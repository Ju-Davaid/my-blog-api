import { minuteToMilliseconds } from '../utils/index.ts';

export enum CacheKey {
  /** 验证码key前缀*/
  CAPTCHA_PREFIX = 'captcha:',
  /** 邮箱验证码key前缀*/
  EMAIL_CODE_PREFIX = 'email:code:',
  /*** 刷新tokenkey前缀*/
  REFRESH_TOKEN_PREFIX = 'refreshToken:',
}

export enum CacheTTL {
  /** 验证码有效期*/
  CAPTCHA_TTL = minuteToMilliseconds(1),
  /*** 邮箱验证码有效期*/
  EMAIL_CODE_TTL = minuteToMilliseconds(5),
  /*** 刷新token有效期*/
  REFRESH_TOKEN_TTL = minuteToMilliseconds(7 * 24 * 60),
}
