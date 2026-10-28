import TimeUtils from '../utils/time.utils.ts';

export enum MyCacheKey {
  /** 验证码key前缀*/
  CAPTCHA_PREFIX = 'captcha:',
  /** 邮箱验证码key前缀*/
  EMAIL_CODE_PREFIX = 'email:code:',
  /*** 刷新tokenkey前缀*/
  REFRESH_TOKEN_PREFIX = 'refreshToken:',
  /*** 黑名单tokenkey前缀*/
  BLACK_TOKEN_PREFIX = 'blackToken:',
}

export enum MyCacheTTL {
  /** 验证码有效期*/
  CAPTCHA_TTL = TimeUtils.minuteToMilliseconds(1),
  /*** 邮箱验证码有效期*/
  EMAIL_CODE_TTL = TimeUtils.minuteToMilliseconds(5),
  /*** 刷新token有效期*/
  REFRESH_TOKEN_TTL = TimeUtils.minuteToMilliseconds(7 * 24 * 60),
}
