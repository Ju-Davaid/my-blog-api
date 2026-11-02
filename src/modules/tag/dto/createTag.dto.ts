import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

class CreateTagDTO {
  @ApiProperty({ description: '标签名称' })
  @IsString({ message: '标签名称必须是字符串' })
  @IsNotEmpty({ message: '标签名称不能为空' })
  name: string;

  @ApiProperty({ description: '标签颜色' })
  @IsString({ message: '标签颜色必须是字符串' })
  @IsNotEmpty({ message: '标签颜色不能为空' })
  hue: string;
}

export default CreateTagDTO;
