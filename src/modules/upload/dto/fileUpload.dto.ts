import { ApiProperty } from '@nestjs/swagger';

class FileUploadDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: '上传文件',
  })
  file: File;
}

export default FileUploadDto;
