import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration.ts';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule, SmtpTransport, FileTemplateEngine } from '@nestjs/mail';
import { join } from 'node:path';
import { AuthModule } from './modules/auth/auth.module.ts';
import { ThrottlerModule } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './common/guard/jwt.guard.ts';
import { PostModule } from './modules/post/post.module.js';

@Module({
  imports: [
    // 配置模块
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    // 数据库ORM模块
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const logger = new Logger('AppModule');
        logger.log(`NODE_ENV: ${process.env.NODE_ENV}`);
        const synchronize = process.env.NODE_ENV === 'development';
        return {
          type: 'mysql',
          host: configService.getOrThrow('dataSource.host'),
          port: configService.getOrThrow('dataSource.port'),
          username: configService.getOrThrow('dataSource.username'),
          password: configService.getOrThrow('dataSource.password'),
          database: configService.getOrThrow('dataSource.database'),
          synchronize,
          autoLoadEntities: true,
        };
      },
      inject: [ConfigService],
    }),
    // 邮件模块
    MailModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return {
          templates: new FileTemplateEngine({
            dir: join(import.meta.dirname, 'static/mail/templates'),
            cache: process.env.NODE_ENV === 'production',
          }),
          from: `DAVAID Blog 验证码服务 <${configService.getOrThrow('mail.user')}>`,
          transport: new SmtpTransport({
            host: configService.getOrThrow('mail.host'),
            port: configService.getOrThrow('mail.port'),
            secure: true, // 465 端口必须为 true (SSL)
            auth: {
              user: configService.getOrThrow('mail.user'),
              pass: configService.getOrThrow('mail.password'),
            },
          }),
        };
      },
      inject: [ConfigService],
    }),
    // 限流模块
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
    // 缓存模块
    CacheModule.register({
      isGlobal: true,
    }),
    AuthModule,
    PostModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: JwtGuard }],
})
export class AppModule {}
