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
   * 处理批量文件上传
   * @param files 实际上传的文件（被去重跳过的文件不在其中）
   * @param md5 文件的md5值（单个或多个）
   * @returns 与 md5 顺序一致的文件路径数组
   */
  public handleMultipleUpload(
    files: Express.Multer.File[] | undefined,
    md5?: string | string[],
  ) {
    const md5List = Array.isArray(md5) ? md5 : md5 ? [md5] : [];
    if (!files?.length && !md5List.length) {
      throw new BadRequestException('参数错误');
    }
    const uploadRoot = path.join(process.cwd(), 'upload');
    // 已写盘的文件按文件名（即 md5）建立索引
    const urlByMd5 = new Map<string, string>();
    for (const file of files ?? []) {
      const urlPath = path
        .relative(uploadRoot, file.path)
        .split(path.sep)
        .join('/');
      const fileMd5 = path.basename(file.filename, path.extname(file.filename));
      urlByMd5.set(fileMd5, `/static/${urlPath}`);
    }
    // 被去重跳过的文件回查已存在的路径，保证返回顺序与 md5 一致
    return md5List.map((item) => {
      const url = urlByMd5.get(item) ?? this.findExistedByMd5(uploadRoot, item);
      if (!url) {
        throw new BadRequestException(`文件上传失败: ${item}`);
      }
      return url;
    });
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
