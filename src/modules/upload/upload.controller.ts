import {
  Controller,
  Post,
  Req,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorator/auth.decorator.ts';
import FileUploadDto from './dto/fileUpload.dto.ts';
import MultipleUploadDto from './dto/multipleUpload.dto.ts';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import type { Request } from 'express';
import { UploadService } from './upload.service.ts';
import { ConfigService } from '@nestjs/config';

@Public()
@ApiTags('上传模块')
@Controller('upload')
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  @ApiBody({ type: FileUploadDto })
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: '上传文件' })
  @UseInterceptors(FileInterceptor('files'))
  async upload(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    const localPath = this.uploadService.handleSingleUpload(
      file,
      req.body?.md5,
    );
    return {
      url: `${this.configService.get('app.url')}:${this.configService.get('app.port')}${localPath}`,
    };
  }

  @Post('batch')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: MultipleUploadDto,
  })
  @ApiOperation({ summary: '批量上传文件' })
  @UseInterceptors(FilesInterceptor('files', 20))
  async uploadBatch(
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: Request,
  ) {
    const localPaths = this.uploadService.handleMultipleUpload(
      files,
      req.body?.md5,
    );
    const baseUrl = `${this.configService.get('app.url')}:${this.configService.get('app.port')}`;
    return {
      urls: localPaths.map((localPath) => `${baseUrl}${localPath}`),
    };
  }
}
