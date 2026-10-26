import { join } from 'node:path';
import { ExceptionFilter, ArgumentsHost, HttpException } from '@nestjs/common';
import ResponseVO from '../vo/response.vo.ts';

class MyExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const errResponse = exception.getResponse() as Record<string, any>;
    return response
      .status(errResponse.statusCode)
      .json(
        ResponseVO.error(
          errResponse.statusCode,
          errResponse.message.join(', '),
          null,
        ),
      );
  }
}

export default MyExceptionFilter;
