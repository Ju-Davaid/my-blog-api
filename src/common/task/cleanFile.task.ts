import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import { Cron, Interval } from '@nestjs/schedule';
import fs from 'fs';
import { getAllFiles } from '../utils/file.utils.ts';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Post from '../../modules/post/entity/post.entity.ts';
import Photo from '../../modules/album/entity/photo.entity.ts';

@Injectable()
class CleanFileTask {
  private readonly logger = new Logger(CleanFileTask.name);
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Photo)
    private readonly photoRepository: Repository<Photo>,
  ) {}

  @Cron('0 0 5 * * *')
  public async handleClean() {
    this.logger.debug('开始清理未使用的文件');
    const uploadRoot = path.join(process.cwd(), '/upload');
    const filePathList: string[] = [];
    getAllFiles(uploadRoot, filePathList);
    const deleteTaskList: Promise<void>[] = filePathList.map((file) => {
      return new Promise(async (resolve, reject) => {
        const keyword = `%${path.relative(uploadRoot, file).replace(/\\/g, '/')}%`;
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
        const useCount = postCount + photoCount;
        console.log(useCount);
        if (useCount === 0) {
          fs.unlink(file, (err) => {
            if (err) {
              this.logger.error(`删除文件失败: ${file}`);
              reject();
            } else {
              this.logger.debug(`删除文件: ${file}`);
              resolve();
            }
          });
        }
      });
    });
    await Promise.allSettled(deleteTaskList);
  }
}

export default CleanFileTask;
