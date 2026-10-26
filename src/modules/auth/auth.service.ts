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

@Injectable()
export class AuthService {
  private readonly CODE_TTL_MINUTES: number = 5; // 有效期
  private readonly CODE_PREFIX: string = 'email:verify:';
  private readonly logger = new Logger(AuthService.name); // 验证码缓存前缀

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly mailer: Mailer,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

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
