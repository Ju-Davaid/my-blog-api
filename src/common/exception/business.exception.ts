import { HttpException, HttpStatus } from '@nestjs/common';

export interface BusinessExceptionOptions {
  /** 业务错误码（与 HTTP status 区分开），默认等于 status */
  code?: number;
  /** 额外的上下文数据 */
  data?: any;
}

/**
 * 业务异常：业务层主动抛出，客户端可通过 code 识别错误类型。
 *
 * @example
 *   throw new BusinessException('邮箱已被注册', 409, { code: 1001 });
 */
export class BusinessException extends HttpException {
  public readonly businessCode: number;
  public readonly extraData: any;

  constructor(
    message: string,
    status: HttpStatus = HttpStatus.BAD_REQUEST,
    options: BusinessExceptionOptions = {},
  ) {
    super(message, status);
    this.businessCode = options.code ?? status;
    this.extraData = options.data ?? null;
    // 让 stack trace 指向抛出处
    Object.setPrototypeOf(this, BusinessException.prototype);
  }
}
