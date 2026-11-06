import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

class MultipleUploadDto {
  @ApiProperty({
    type: 'array',
    items: { type: 'string' },
    description: '文件md5值数组，顺序与files一致',
  })
  @IsArray()
  md5: string[];

  @ApiProperty({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    description: '文件数组',
  })
  @IsArray()
  files: Express.Multer.File[];
}

export default MultipleUploadDto;
