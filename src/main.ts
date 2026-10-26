import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.ts';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { ResponseWrapInterceptorInterceptor } from './common/interceptors/responsewrap.interceptor.js';
import MyExceptionFilter from './common/filter/exception.filter.ts';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const swaggerEnabled = configService.getOrThrow('swagger.enabled');
  // 全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 剥离 DTO 中未声明的属性
      forbidNonWhitelisted: true, // 对未声明的属性直接抛出异常
      transform: true, // 将请求数据转换为 DTO 类实例
      transformOptions: {
        enableImplicitConversion: true, // 根据 TS 类型自动转换基础类型
      },
    }),
  );
  // 全局异常过滤器
  app.useGlobalFilters(new MyExceptionFilter());
  // 全局响应拦截器
  app.useGlobalInterceptors(new ResponseWrapInterceptorInterceptor());
  // 配置 Swagger 文档
  if (swaggerEnabled) {
    const apiDocument = new DocumentBuilder()
      .setTitle('我的个人博客系统 API 文档')
      .build();
    const swaggerDocument = SwaggerModule.createDocument(app, apiDocument);
    SwaggerModule.setup('doc', app, swaggerDocument, {
      swaggerOptions: {},
    });
  }
  const port = configService.getOrThrow('port');
  await app.listen(port);
}
await bootstrap();
