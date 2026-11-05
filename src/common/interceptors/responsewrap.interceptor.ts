import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import ResponseVO from '../vo/response.vo.js';
import { Observable, map } from 'rxjs';

const pad = (n: number) => String(n).padStart(2, '0');

const formatDateTime = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
  `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;

const transformDates = (value: any): unknown => {
  if (value instanceof Date) return formatDateTime(value);
  if (Array.isArray(value)) return value.map(transformDates);
  if (value && typeof value === 'object') {
    for (const [key, v] of Object.entries(value)) {
      (value as Record<string, any>)[key] = transformDates(v);
    }
  }
  return value;
};

@Injectable()
export class ResponseWrapInterceptorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(map((data) => ResponseVO.success(transformDates(data))));
  }
}
