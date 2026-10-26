import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class UserLoginDto {
  @ApiProperty({ description: '用户名', example: 'test' })
  @IsString({ message: '用户名必须是字符串' })
  @IsNotEmpty({ message: '用户名不能为空' })
  @MinLength(4, { message: '用户名长度不能小于4位' })
  @MaxLength(12, { message: '用户名长度不能大于12位' })
  username: string;

  @ApiProperty({ description: '密码', example: '123456' })
  @IsString({ message: '密码必须是字符串' })
  @IsNotEmpty({ message: '密码不能为空' })
  @MinLength(6, { message: '密码长度不能小于6位' })
  @MaxLength(12, { message: '密码长度不能大于12位' })
  password: string;

  @ApiProperty({ description: '验证码key', example: 'xxxx-xxxx-xxxx' })
  @IsString({ message: '验证码key必须是字符串' })
  @IsNotEmpty({ message: '验证码key不能为空' })
  captchaKey: string;

  @ApiProperty({ description: '验证码', example: 'xxxx' })
  @IsString({ message: '验证码必须是字符串' })
  @MinLength(4, { message: '验证码长度不能小于4位' })
  @MaxLength(4, { message: '验证码长度不能大于4位' })
  @IsNotEmpty({ message: '验证码不能为空' })
  captcha: string;
}

export default UserLoginDto;
