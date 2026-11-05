import { BadRequestException, Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class UploadService {
  /**
   * 处理单个文件上传
   * @param file 上传的文件
   * @param md5 文件的md5值
   * @returns 上传后的文件路径
   */
  public handleSingleUpload(
    file: Express.Multer.File | undefined,
    md5?: string,
  ) {
    const uploadRoot = path.join(process.cwd(), 'upload');
    if (!file) {
      const existed = this.findExistedByMd5(uploadRoot, md5);
      if (!existed) {
        throw new BadRequestException('参数错误');
      }
      return existed;
    }
    const urlPath = path
      .relative(uploadRoot, file.path)
      .split(path.sep)
      .join('/');
    return `/static/${urlPath}`;
  }

  /**
   * 查找已存在的文件路径
   * @param uploadRoot 上传根目录
   * @param md5 文件的md5值
   * @returns 已存在的文件路径
   */
  private findExistedByMd5(uploadRoot: string, md5?: string) {
    if (!md5) return null;
    const now = new Date();
    const subDir = `${now.getFullYear()}/${now.getMonth() + 1}`;
    const dir = path.join(uploadRoot, subDir);
    if (!fs.existsSync(dir)) return null;
    const name = fs
      .readdirSync(dir)
      .find((fileName) => fileName.startsWith(`${md5}.`));
    return name ? `/static/${subDir}/${name}` : null;
  }
}
