import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
  ValidationError,
} from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';
import ResponseVO from '../vo/response.vo.js';
import { BusinessException } from '../exception/business.exception.ts';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);
  private readonly isDev = process.env.NODE_ENV !== 'production';

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    // 客户端已断开，不再写响应
    if (response.writableEnded || response.headersSent) {
      this.logger.warn(
        `[${request.method} ${request.url}] client closed before response sent`,
      );
      return;
    }

    const { status, code, message } = this.resolve(exception);

    this.log(request, exception, status);

    response
      .status(status)
      .json(
        ResponseVO.error(
          code,
          message,
          this.isDev ? this.extractCause(exception) : null,
        ),
      );
  }

  private resolve(err: unknown): {
    status: number;
    code: number;
    message: string;
  } {
    if (err instanceof BusinessException) {
      return {
        status: err.getStatus(),
        code: err.businessCode,
        message: err.message,
      };
    }

    if (err instanceof HttpException) {
      const status = err.getStatus();
      const raw = err.getResponse();
      return {
        status,
        code: status,
        message: this.extractMessage(raw, err.message),
      };
    }

    if (err instanceof QueryFailedError) {
      return {
        status: HttpStatus.BAD_REQUEST,
        code: HttpStatus.BAD_REQUEST,
        message: this.pgMySqlMessage(err),
      };
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      message: this.isDev
        ? err instanceof Error
          ? err.message
          : String(err)
        : 'Internal Server Error',
    };
  }

  private extractMessage(raw: unknown, fallback: string): string {
    if (typeof raw === 'string') return raw;
    if (Array.isArray(raw)) return raw.join('; ');
    if (raw && typeof raw === 'object') {
      const obj = raw as Record<string, any>;
      if (Array.isArray(obj.message)) {
        return obj.message.map(this.formatValidationMessage).join('; ');
      }
      if (typeof obj.message === 'string') return obj.message;
    }
    return fallback;
  }

  private formatValidationMessage(item: string | ValidationError): string {
    if (typeof item === 'string') return item;
    const path = item.property;
    const constraints = item.constraints ?? {};
    const first = Object.values(constraints)[0];
    return first ? `${path}: ${first}` : path;
  }

  private pgMySqlMessage(err: QueryFailedError): string {
    const msg = (err as any).message as string;
    if (!msg) return '数据库操作失败';
    // MySQL: Duplicate entry 'x' for key 'uk_xxx'
    if (/duplicate entry/i.test(msg)) {
      const key = /for key '([^']+)'/i.exec(msg)?.[1] ?? '';
      return `数据重复，唯一约束冲突${key ? `（${key}）` : ''}`;
    }
    if (/duplicate key value violates unique constraint/i.test(msg)) {
      const key = /"([^"]+)"/.exec(msg)?.[1] ?? '';
      return `数据重复，唯一约束冲突${key ? `（${key}）` : ''}`;
    }
    if (/foreign key constraint/i.test(msg) || /references/i.test(msg)) {
      return '关联数据不存在，无法操作';
    }
    return '数据库操作失败';
  }

  private extractCause(err: unknown): any {
    if (err instanceof QueryFailedError) {
      return { driver: (err as any).code, sql: (err as any).query };
    }
    if (err instanceof Error) return { stack: err.stack };
    return null;
  }

  private log(request: any, err: unknown, status: number) {
    const prefix = `[${request.method} ${request.originalUrl ?? request.url}] ${status}`;
    if (status >= 500) {
      this.logger.error(prefix, err instanceof Error ? err.stack : String(err));
    } else if (this.isDev) {
      this.logger.debug(
        prefix,
        err instanceof Error ? err.message : String(err),
      );
    } else {
      this.logger.warn(
        prefix,
        err instanceof Error ? err.message : String(err),
      );
    }
  }
}

export default AllExceptionsFilter;
