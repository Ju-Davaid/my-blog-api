import { Injectable, Logger } from '@nestjs/common';
import * as path from 'path';
import { Cron } from '@nestjs/schedule';
import { promises as fs } from 'fs';
import { getAllFiles } from '../utils/file.utils.ts';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Post from '../../modules/post/entity/post.entity.ts';
import Photo from '../../modules/album/entity/photo.entity.ts';

@Injectable()
class CleanFileTask {
  private readonly logger = new Logger(CleanFileTask.name);
  private readonly CONCURRENCY = 10;

  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Photo)
    private readonly photoRepository: Repository<Photo>,
  ) {}

  /**
   * 每天 5 点清理未被文章或相册引用的上传文件
   */
  @Cron('0 0 5 * * *')
  public async handleClean() {
    const uploadRoot = path.join(process.cwd(), 'upload');
    const filePathList: string[] = [];
    getAllFiles(uploadRoot, filePathList);
    this.logger.debug(
      `开始清理未使用的文件，共 ${filePathList.length} 个文件`,
    );

    let deletedCount = 0;
    for (let i = 0; i < filePathList.length; i += this.CONCURRENCY) {
      const batch = filePathList.slice(i, i + this.CONCURRENCY);
      const results = await Promise.allSettled(
        batch.map((file) => this.cleanSingle(file, uploadRoot)),
      );
      deletedCount += results.filter(
        (result) => result.status === 'fulfilled' && result.value,
      ).length;
    }

    this.logger.debug(`清理结束，共删除 ${deletedCount} 个未使用文件`);
  }

  /**
   * 检查单个文件是否被引用，未被引用则删除
   * @param file 文件绝对路径
   * @param uploadRoot 上传根目录
   * @returns 是否删除成功
   */
  private async cleanSingle(file: string, uploadRoot: string) {
    const keyword = `%${path.relative(uploadRoot, file).replace(/\\/g, '/')}%`;
    try {
      const [postCount, photoCount] = await Promise.all([
        this.postRepository
          .createQueryBuilder('post')
          .where('post.content LIKE :kw', { kw: keyword })
          .orWhere('post.cover LIKE :kw', { kw: keyword })
          .getCount(),
        this.photoRepository
          .createQueryBuilder('photo')
          .where('photo.path LIKE :kw', { kw: keyword })
          .getCount(),
      ]);
      if (postCount + photoCount > 0) return false;
      await fs.unlink(file);
      this.logger.debug(`删除文件: ${file}`);
      return true;
    } catch (error) {
      this.logger.error(
        `处理文件失败: ${file}`,
        error instanceof Error ? error.stack : String(error),
      );
      return false;
    }
  }
}

export default CleanFileTask;
