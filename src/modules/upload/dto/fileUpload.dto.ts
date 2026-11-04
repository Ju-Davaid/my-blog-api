import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

class FileUploadDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: '上传文件',
  })
  file: File;

  @ApiProperty({
    type: 'string',
    description: '文件md5值',
  })
  @IsNotEmpty({ message: '文件md5值不能为空' })
  @IsString({ message: '文件md5值必须是字符串' })
  md5: string;
}

export default FileUploadDto;
