import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class SendVerifyCodeDto {
  @ApiProperty({ description: '用户邮箱' })
  @IsEmail({}, { message: '邮箱格式错误' })
  @IsNotEmpty({ message: '邮箱不能为空' })
  email: string;
}

export default SendVerifyCodeDto;
