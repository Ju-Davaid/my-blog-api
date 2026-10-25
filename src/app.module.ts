import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration.ts';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return {
          type: 'mysql',
          host: configService.getOrThrow('dataSource.host'),
          port: configService.getOrThrow('dataSource.port'),
          username: configService.getOrThrow('dataSource.username'),
          password: configService.getOrThrow('dataSource.password'),
          database: configService.getOrThrow('dataSource.database'),
          // synchronize:true,
          autoLoadEntities: true,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
