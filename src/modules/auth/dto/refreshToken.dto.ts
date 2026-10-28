import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

class RefreshTokenDto {
  @ApiProperty({ description: '刷新token' })
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}

export default RefreshTokenDto;
