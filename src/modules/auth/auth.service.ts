import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import User from './entity/user.entity.ts';
import UserRegisterDto from './dto/userRegister.dto.ts';
import { Mailer } from '@nestjs/mail';
import { BusinessException } from '../../common/exception/business.exception.ts';
import { type Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import bcrypt from 'bcrypt';
import * as svgCaptcha from 'svg-captcha';
import { v4 as uuidV4 } from 'uuid';
import UserLoginDto from './dto/userLogin.dto.ts';
import { JwtService } from '@nestjs/jwt';
import LoginVO from './vo/login.vo.ts';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './jwt.strategy.ts';

@Injectable()
export class AuthService {
  private ACCESS_TOKEN_TTL: number;
  private REFRESH_TOKEN_TTL: number;
  private readonly CODE_TTL_MINUTES: number = 5; // 邮箱验证码有效期
  private readonly CAPTCHA_PREFIX: string = 'captcha:';
  private readonly CODE_PREFIX: string = 'email:verify:';
  private readonly CAPTCHA_TTL_MINUTES: number = 1; // 图片验证码有效期
  private readonly logger = new Logger(AuthService.name); // 验证码缓存前缀
  private readonly REFRESH_TOKEN_PREFIX: string = 'refresh-token:';

  constructor(
    private readonly mailer: Mailer,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {
    this.ACCESS_TOKEN_TTL =
      this.configService.getOrThrow<number>('jwt.expiresIn') * 60 * 1000;
    this.REFRESH_TOKEN_TTL =
      this.configService.getOrThrow<number>('jwt.refreshTokenExpiresIn') *
      60 *
      1000;
  }

  /**
   * 用户登录
   * @param dto 登录DTO
   * @returns 登录VO
   */
  public async login(dto: UserLoginDto) {
    try {
      const captcha = await this.cacheManager.get<string>(
        this.CAPTCHA_PREFIX + dto.captchaKey,
      );
      if (!captcha || captcha.toLowerCase() !== dto.captcha.toLowerCase()) {
        throw new BusinessException('验证码错误或已过期');
      }
      const user = await this.userRepository.findOne({
        where: {
          username: dto.username,
        },
      });
      if (!user) {
        throw new BusinessException('用户不存在');
      }
      const passwordMatch = await bcrypt.compare(dto.password, user.password);
      if (!passwordMatch) {
        throw new BusinessException('密码错误');
      }
      const accessToken = this.jwtService.sign<JwtPayload>(
        {
          userId: user.id.toString(),
          username: user.username,
          role: user.role,
          expiresAt: new Date(Date.now() + this.ACCESS_TOKEN_TTL),
        },
        { expiresIn: this.ACCESS_TOKEN_TTL },
      );
      const refreshToken = this.jwtService.sign<JwtPayload>(
        {
          userId: user.id.toString(),
          username: user.username,
          role: user.role,
          expiresAt: new Date(Date.now() + this.REFRESH_TOKEN_TTL),
        },
        {
          secret: this.configService.getOrThrow('jwt.refreshTokenSecret'),
          expiresIn: this.REFRESH_TOKEN_TTL,
        },
      );
      return new LoginVO({
        username: user.username,
        accessToken,
        refreshToken,
        role: user.role,
      });
    } catch (error: any) {
      this.logger.debug('登录用户失败', error.message);
      throw error;
    } finally {
      this.cacheManager.del(this.CAPTCHA_PREFIX + dto.captchaKey);
    }
  }

  /**
   * 获取验证码
   * @param width 验证码宽度
   * @param height 验证码高度
   * @param captchaKey 验证码key，不传则自动生成
   * @returns 验证码 key 和 svg 图片
   */
  public async getCaptcha(width: number, height: number, captchaKey?: string) {
    const captcha = svgCaptcha.create({
      size: 4,
      fontSize: 52,
      width,
      height,
      noise: 2,
      color: true,
      background: '#ffffff',
      ignoreChars: '0oO1ilI', // 剔除容易混淆字符
    });
    const finalKey = captchaKey ?? uuidV4();
    const code = captcha.text;
    await this.cacheManager.set(
      this.CAPTCHA_PREFIX + finalKey,
      code,
      this.CAPTCHA_TTL_MINUTES * 60 * 1000,
    );
    return {
      captchaKey: finalKey,
      img: captcha.data,
    };
  }

  /**
   * 注册用户
   * @param dto 用户注册DTO
   * @returns 用户注册DTO
   */
  public async register(dto: UserRegisterDto) {
    try {
      const captcha = await this.cacheManager.get(this.CODE_PREFIX + dto.email);
      this.logger.debug(
        `验证码缓存：${this.CODE_PREFIX + dto.email}，验证码：${captcha}`,
      );
      if (!captcha || captcha !== dto.captcha) {
        throw new BusinessException('验证码错误或已过期');
      }
      const password = await bcrypt.hash(dto.password, 10);
      const newUser = new User(dto.username, password);
      await this.userRepository.save(newUser);
    } catch (error: any) {
      this.logger.debug('注册用户失败', error.message);
      this.cacheManager.del(this.CODE_PREFIX + dto.email);
      throw error;
    }
  }

  /**
   * 发送注册验证码
   * @param email 用户邮箱
   * @returns 验证码
   */
  public async sendCode(email: string) {
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    try {
      await Promise.all([
        this.mailer.send({
          to: email,
          subject: '注册验证码',
          template: 'verifycode',
          context: {
            verifyCode,
            expireTime: this.CODE_TTL_MINUTES,
          },
        }),
        this.cacheManager.set(
          this.CODE_PREFIX + email,
          verifyCode,
          this.CODE_TTL_MINUTES * 60 * 1000,
        ),
      ]);
      this.logger.log('发送注册验证码成功');
      this.logger.log(
        `验证码缓存成功，key：${this.CODE_PREFIX + email}，验证码：${verifyCode}，有效期：${this.CODE_TTL_MINUTES}分钟。`,
      );
    } catch (error: any) {
      this.logger.log('发送注册验证码失败', error.message);
      throw new BusinessException(error.message);
    }
  }
}
