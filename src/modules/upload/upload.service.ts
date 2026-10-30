import { BadRequestException, Injectable } from '@nestjs/common';
import * as path from 'path';

@Injectable()
export class UploadService {
  public handleSingleUpload(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('参数错误');
    }
    const uploadRoot = path.join(process.cwd(), 'upload');
    const urlPath = path
      .relative(uploadRoot, file.path)
      .split(path.sep)
      .join('/');
    const localUrl = `/static/${urlPath}`;
    return localUrl;
  }
}
