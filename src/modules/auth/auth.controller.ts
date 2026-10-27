import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service.ts';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import SendVerifyCodeDto from './dto/sendVerifyCode.dto.ts';
import UserRegisterDto from './dto/userRegister.dto.ts';
import UserLoginDto from './dto/userLogin.dto.ts';
import { type Response } from 'express';
import CaptchaDto from './dto/captcua.dto.ts';
import { Public } from '../../common/decorator/public.decorator.ts';

@Public()
@Controller('auth')
@ApiTags('用户登录注册')
export class AuthController {
  private readonly CAPTCHA_HEADER_KEY = 'x-captcha-key';
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: '用户登录' })
  public login(@Body() userLoginDto: UserLoginDto) {
    return this.authService.login(userLoginDto);
  }

  @Get('/captcha')
  @ApiOperation({ summary: '获取验证码' })
  @ApiResponse({ status: 200, description: '获取成功' })
  @ApiResponse({ status: 500, description: '服务器错误' })
  public async getCaptcha(
    @Query() captchaDto: CaptchaDto,
    @Res() res: Response,
  ) {
    const { captchaKey, img } = await this.authService.getCaptcha(
      captchaDto.width,
      captchaDto.height,
    );
    res.setHeader('Cache-Control', 'public, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader(this.CAPTCHA_HEADER_KEY, captchaKey);
    res.contentType('image/svg+xml');
    res.send(img);
  }

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
