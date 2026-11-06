import { BadRequestException, Module } from '@nestjs/common';
import { UploadService } from './upload.service.ts';
import { UploadController } from './upload.controller.ts';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';

@Module({
  imports: [
    {
      global: true,
      ...MulterModule.register({
        fileFilter: (req, file, cb) => {
          const md5Raw = req.body?.md5 as string | string[];
          const md5List = Array.isArray(md5Raw) ? md5Raw : md5Raw ? [md5Raw] : [];
          // fileFilter 按文件在 multipart 中的顺序逐个触发，用计数器对齐 md5
          const state = req as {
            _md5Idx?: number;
            _currentMd5?: string;
          };
          const idx = state._md5Idx ?? 0;
          state._md5Idx = idx + 1;
          const md5 = md5List[idx];
          if (!md5) return cb(new BadRequestException('缺少md5'), false);
          const now = new Date();
          const year = now.getFullYear();
          const month = now.getMonth() + 1;
          const originalname = Buffer.from(
            file.originalname,
            'latin1',
          ).toString('utf8');
          const des = path.join(
            process.cwd(),
            '/upload',
            `${year}/${month}`,
            `${md5}${path.extname(originalname)}`,
          );
          if (fs.existsSync(des)) {
            cb(null, false);
          } else if (!['image/jpeg', 'image/png'].includes(file.mimetype)) {
            cb(new BadRequestException('非法文件类型'), false);
          } else {
            // filename 回调会在该文件被接受后立即触发，暂存当前 md5
            state._currentMd5 = md5;
            cb(null, true);
          }
        },
        limits: {
          fileSize: 1024 * 1024 * 20,
        },
        storage: diskStorage({
          destination: (_req, _file, cb) => {
            const now = new Date();
            const year = now.getFullYear();
            const month = now.getMonth() + 1;
            const uploadPath = path.join(
              process.cwd(),
              '/upload',
              `${year}/${month}`,
            );
            if (!fs.existsSync(uploadPath)) {
              fs.mkdirSync(uploadPath, { recursive: true });
            }
            cb(null, uploadPath);
          },
          filename: (req, file, cb) => {
            const md5 = (req as unknown as { _currentMd5?: string })
              ._currentMd5;
            const originalname = Buffer.from(
              file.originalname,
              'latin1',
            ).toString('utf8');
            cb(null, `${md5}${path.extname(originalname)}`);
          },
        }),
      }),
    },
  ],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
