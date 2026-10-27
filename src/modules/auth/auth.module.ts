import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import User from './entity/user.entity.ts';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy.ts';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.getOrThrow('jwt.secret'),
          signOptions: {
            expiresIn: configService.getOrThrow('jwt.expiresIn'),
            audience: configService.getOrThrow('jwt.audience'),
            issuer: configService.getOrThrow('jwt.issuer'),
            algorithm: configService.getOrThrow('jwt.algorithm'),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [TypeOrmModule],
})
export class AuthModule {}
