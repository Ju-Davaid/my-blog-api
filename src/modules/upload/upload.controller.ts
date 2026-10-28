import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UploadService } from './upload.service.ts';
import { Public } from '../../common/decorator/auth.decorator.ts';
import FileUploadDto from './dto/fileUpload.dto.ts';
import { FileInterceptor } from '@nestjs/platform-express';

@Public()
@ApiTags('上传模块')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @ApiBody({ type: FileUploadDto })
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: '上传文件' })
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: any) {
    console.log();
    return file.name;
  }
}
