import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import ResponseVO from '../vo/response.vo.js';
import { Observable, map } from 'rxjs';

@Injectable()
export class ResponseWrapInterceptorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => ResponseVO.success(data)));
  }
}
