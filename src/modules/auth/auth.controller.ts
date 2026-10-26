import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service.ts';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import SendVerifyCodeDto from './dto/sendVerifyCode.dto.ts';
import UserRegisterDto from './dto/userRegister.dto.ts';

@Controller('auth')
@ApiTags('用户登录注册')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: '用户注册' })
  @ApiResponse({ status: 200, description: '注册成功' })
  @ApiResponse({ status: 400, description: '参数错误' })
  public register(@Body() userRegisterDto: UserRegisterDto) {
    return this.authService.register(userRegisterDto);
  }

  @Get('send-code')
  @ApiOperation({ summary: '发送注册验证码' })
  @ApiResponse({ status: 200, description: '发送成功' })
  @ApiResponse({ status: 400, description: '邮箱格式错误' })
  public sendCode(@Query() sendVerifyCodeDto: SendVerifyCodeDto) {
    return this.authService.sendCode(sendVerifyCodeDto.email);
  }
}
