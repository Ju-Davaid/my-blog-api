import { IsNumber, IsNotEmpty, IsString, Allow } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class AddPhotoDTO {
  @ApiProperty({
    type: 'string',
    description: '文件md5值',
  })
  @IsNotEmpty({ message: '文件md5值不能为空' })
  @IsString({ message: '文件md5值必须是字符串' })
  md5: string;

  @ApiProperty({ description: '相册ID', type: 'number' })
  @IsNumber({}, { message: '相册ID必须是数字' })
  @IsNotEmpty()
  albumId: number;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: '上传文件',
  })
  @Allow()
  file: Express.Multer.File;
}
export default AddPhotoDTO;
