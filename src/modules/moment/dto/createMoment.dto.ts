import { ApiProperty } from '@nestjs/swagger';
import MultipleUploadDto from '../../upload/dto/multipleUpload.dto.ts';
import { IsArray, IsOptional, IsString } from 'class-validator';

class CreateMomentDTO {
  @IsString()
  @ApiProperty({
    type: 'string',
    description: '动态内容',
  })
  content: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: 'string',
    description: '动态分类',
    required: false,
  })
  category: string;

  @ApiProperty({
    type: 'array',
    description: '动态照片url数组',
    required: true,
  })
  @IsArray({ message: '动态照片url数组必须是数组' })
  @IsString({ each: true, message: '动态照片url数组中的元素必须是字符串' })
  urls: string[];
}

export default CreateMomentDTO;
