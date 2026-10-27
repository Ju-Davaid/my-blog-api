import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

class RefreshTokenDto {
  @ApiProperty({ description: '访问token' })
  @IsNotEmpty()
  @IsString()
  accessToken: string;

  @ApiProperty({ description: '刷新token' })
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}

export default RefreshTokenDto;
