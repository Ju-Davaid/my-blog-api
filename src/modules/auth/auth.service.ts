import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import User from './entity/user.entity.ts';
import UserRegisterDto from './dto/userRegister.dto.ts';
import { Mailer } from '@nestjs/mail';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import bcrypt from 'bcrypt';
import * as svgCaptcha from 'svg-captcha';
import { v4 as uuidV4 } from 'uuid';
import UserLoginDto from './dto/userLogin.dto.ts';
import { JwtService } from '@nestjs/jwt';
import LoginVO from './vo/login.vo.ts';
import { ConfigService } from '@nestjs/config';
import { type AuthUser, type JwtPayload } from './jwt.strategy.ts';
import { MyCacheKey, MyCacheTTL } from '../../common/enum/cache.enum.ts';
import { BusinessException } from '../../common/exception/business.exception.ts';
import RefreshTokenDto from './dto/refreshToken.dto.ts';
import RefreshTokenVO from './vo/refreshToken.vo.ts';

@Injectable()
export class AuthService {
  private ACCESS_TOKEN_TTL: number;
  private REFRESH_TOKEN_TTL: number;
  private readonly logger = new Logger(AuthService.name); // 验证码缓存前缀

  constructor(
    private readonly mailer: Mailer,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {
    this.ACCESS_TOKEN_TTL =
      this.configService.getOrThrow<number>('jwt.expiresIn');
    this.REFRESH_TOKEN_TTL = this.configService.getOrThrow<number>(
      'jwt.refreshTokenExpiresIn',
    );
    this.logger.debug(`JWT过期时间: ${this.ACCESS_TOKEN_TTL}`);
    this.logger.debug(`JWT刷新token过期时间: ${this.REFRESH_TOKEN_TTL}`);
  }

  /**
   * 用户登录
   * @param dto 登录DTO
   * @returns 登录VO
   */
  public async login(dto: UserLoginDto) {
    try {
      const captcha = await this.cacheManager.get<string>(
        MyCacheKey.CAPTCHA_PREFIX + dto.captchaKey,
      );
      if (!captcha || captcha.toLowerCase() !== dto.captcha.toLowerCase()) {
        throw new BusinessException('验证码错误或已过期');
      }
      const user = await this.userRepository.findOne({
        where: {
          username: dto.username,
        },
      });
      const passwordMatch =
        !!user && (await bcrypt.compare(dto.password, user.password));
      if (!user || !passwordMatch) {
        throw new BusinessException('用户名或密码错误');
      }
      const accessToken = this.jwtService.sign<JwtPayload>(
        {
          userId: user.id,
          username: user.username,
          role: user.role,
          expiresAt: new Date(Date.now() + this.ACCESS_TOKEN_TTL),
        },
        { expiresIn: this.ACCESS_TOKEN_TTL },
      );
      const refreshToken = this.jwtService.sign<JwtPayload>(
        {
          userId: user.id,
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
      this.logger.error('登录用户失败', error.message);
      throw error;
    } finally {
      this.cacheManager.del(MyCacheKey.CAPTCHA_PREFIX + dto.captchaKey);
    }
  }

  /**
   * 用户退出登录
   * @param user 用户信息
   */
  public async logout(user: AuthUser) {
    this.logger.debug(`用户${user.username}退出登录`);
    const ttl = user.expiresAt.getTime() - Date.now();
    if (ttl <= 0) return;
    await this.cacheManager.set(
      MyCacheKey.BLACK_TOKEN_PREFIX + user.accessToken,
      true,
      ttl,
    );
  }

  /**
   * 刷新token
   * @param dto 刷新tokenDTO
   * @param accessToken 旧的 accessToken
   * @returns 新的 accessToken 和 refreshTokenVO
   */
  public async refreshToken(dto: RefreshTokenDto, accessToken?: string) {
    try {
      const refreshTokenPayload = await this.jwtService.verifyAsync<JwtPayload>(
        dto.refreshToken,
        {
          secret: this.configService.getOrThrow('jwt.refreshTokenSecret'),
        },
      );
      const blacklisted = await this.cacheManager.get<boolean>(
        MyCacheKey.BLACK_TOKEN_PREFIX + dto.refreshToken,
      );
      if (blacklisted) {
        throw new UnauthorizedException('无效token');
      }

      const refreshTTL =
        new Date(refreshTokenPayload.expiresAt).getTime() - Date.now();
      if (refreshTTL > 0) {
        await this.cacheManager.set(
          MyCacheKey.BLACK_TOKEN_PREFIX + dto.refreshToken,
          true,
          refreshTTL,
        );
      }

      if (accessToken) {
        try {
          const accessTokenPayload =
            await this.jwtService.verifyAsync<JwtPayload>(accessToken, {
              secret: this.configService.getOrThrow('jwt.secret'),
            });
          const accessTTL =
            new Date(accessTokenPayload.expiresAt).getTime() - Date.now();
          if (accessTTL > 0) {
            await this.cacheManager.set(
              MyCacheKey.BLACK_TOKEN_PREFIX + accessToken,
              true,
              accessTTL,
            );
          }
        } catch {
          // accessToken 已过期或无效，无需拉黑
        }
      }
      const [newAccessToken, newRefreshToken] = await Promise.all([
        this.jwtService.signAsync<JwtPayload>(
          {
            userId: refreshTokenPayload.userId,
            username: refreshTokenPayload.username,
            role: refreshTokenPayload.role,
            expiresAt: new Date(Date.now() + this.ACCESS_TOKEN_TTL),
          },
          { expiresIn: this.ACCESS_TOKEN_TTL },
        ),
        this.jwtService.signAsync<JwtPayload>(
          {
            userId: refreshTokenPayload.userId,
            username: refreshTokenPayload.username,
            role: refreshTokenPayload.role,
            expiresAt: new Date(Date.now() + this.REFRESH_TOKEN_TTL),
          },
          {
            secret: this.configService.getOrThrow('jwt.refreshTokenSecret'),
            expiresIn: this.REFRESH_TOKEN_TTL,
          },
        ),
      ]);
      return new RefreshTokenVO({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    } catch (error: any) {
      this.logger.error('刷新token失败', error);
      if (error instanceof UnauthorizedException) {
        throw error;
      } else {
        throw new BusinessException('刷新token失败');
      }
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
    this.logger.debug(`验证码${finalKey}过期时间${MyCacheTTL.CAPTCHA_TTL}`);
    await this.cacheManager.set(
      MyCacheKey.CAPTCHA_PREFIX + finalKey,
      code,
      MyCacheTTL.CAPTCHA_TTL,
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
      const captcha = await this.cacheManager.get<string>(
        MyCacheKey.EMAIL_CODE_PREFIX + dto.email,
      );
      if (!captcha || captcha !== dto.captcha) {
        throw new BusinessException('验证码错误或已过期');
      }
      const exists = await this.userRepository.findOne({
        where: [{ username: dto.username }, { email: dto.email }],
      });
      if (exists) {
        throw new BusinessException(
          exists.username === dto.username ? '用户名已存在' : '邮箱已被注册',
        );
      }
      const password = await bcrypt.hash(dto.password, 10);
      await this.userRepository.save(
        new User(dto.username, password, dto.email),
      );
    } catch (error: any) {
      this.logger.debug(`注册用户失败: ${error.message}`);
      throw error;
    } finally {
      // 无论成败都作废验证码，防止同一验证码被重复使用
      await this.cacheManager.del(MyCacheKey.EMAIL_CODE_PREFIX + dto.email);
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
            expireTime: MyCacheTTL.EMAIL_CODE_TTL / 60 / 1000,
          },
        }),
        this.cacheManager.set(
          MyCacheKey.EMAIL_CODE_PREFIX + email,
          verifyCode,
          MyCacheTTL.EMAIL_CODE_TTL,
        ),
      ]);
      this.logger.log('发送注册验证码成功');
      this.logger.log(
        `验证码缓存成功，key：${MyCacheKey.EMAIL_CODE_PREFIX + email}，验证码：${verifyCode}，有效期：${MyCacheTTL.EMAIL_CODE_TTL / 60 / 1000}分钟`,
      );
    } catch (error: any) {
      this.logger.error('发送注册验证码失败', error.stack);
      throw new BusinessException(error.message);
    }
  }
}
