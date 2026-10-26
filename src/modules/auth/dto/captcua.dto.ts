import { IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class CaptchaDto {
  @ApiProperty({ description: '图片宽度', required: false, default: 120 })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: '图片宽度必须是数字' },
  )
  @IsOptional()
  width: number = 120;

  @ApiProperty({ description: '图片高度', required: false, default: 40 })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: '图片高度必须是数字' },
  )
  @IsOptional()
  height: number = 40;
}

export default CaptchaDto;
