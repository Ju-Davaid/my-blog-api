import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRegisterDto } from '../dto/UserRegisterDto.ts';

@ApiTags('用户登录注册')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '用户注册' })
  @Post('register')
  public register(@Body() userRegisterDto: UserRegisterDto) {
    return 'register';
  }
}
