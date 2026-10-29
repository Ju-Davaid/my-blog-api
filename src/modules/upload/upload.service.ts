import { Injectable, Logger } from '@nestjs/common';
import * as path from 'path';
import type { Request } from 'express';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);

  public handleSingleUpload(file: Express.Multer.File, req: Request) {
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
