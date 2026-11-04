import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

class CreateAlbumDTO {
  @ApiProperty({
    description: '相册名称',
  })
  @IsString({ message: '相册名称必须是字符串' })
  @IsNotEmpty({ message: '相册名称不能为空' })
  @MaxLength(20, { message: '相册名称最多20个字符' })
  name: string;

  @IsOptional()
  @ApiProperty({
    description: '相册描述',
    required: false,
  })
  @IsString({ message: '相册描述必须是字符串' })
  @IsNotEmpty({ message: '相册描述不能为空' })
  @MaxLength(50, { message: '相册描述最多50个字符' })
  desc: string;
}

export default CreateAlbumDTO;
