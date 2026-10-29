import {
  Controller,
  Get,
  Logger,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UploadService } from './upload.service.ts';
import { Public } from '../../common/decorator/auth.decorator.ts';
import FileUploadDto from './dto/fileUpload.dto.ts';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import type { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Public()
@ApiTags('上传模块')
@Controller('upload')
export class UploadController {
  private readonly logger = new Logger(UploadController.name);

  constructor(
    private readonly uploadService: UploadService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  @ApiBody({ type: FileUploadDto })
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: '上传文件' })
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    const uploadRoot = path.join(process.cwd(), 'upload');
    const urlPath = path
      .relative(uploadRoot, file.path)
      .split(path.sep)
      .join('/');
    const url = `${req.protocol}://${req.get('host')}/upload/${urlPath}`;
    this.logger.debug(`上传成功: ${url}`);
    return { url };
  }
}
