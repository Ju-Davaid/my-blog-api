import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration.ts';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
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
    AuthModule,
  ],
})
export class AppModule {}
