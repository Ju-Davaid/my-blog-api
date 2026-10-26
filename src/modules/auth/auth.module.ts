import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import User from './entity/user.entity.ts';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [TypeOrmModule],
})
export class AuthModule {}
