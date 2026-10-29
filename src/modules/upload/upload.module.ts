import { BadRequestException, Module } from '@nestjs/common';
import { UploadService } from './upload.service.ts';
import { UploadController } from './upload.controller.ts';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';

@Module({
  imports: [
    MulterModule.register({
      fileFilter: (req, file, cb) => {
        if (!['image/jpeg', 'image/png'].includes(file.mimetype)) {
          cb(new BadRequestException('非法文件类型'), false);
        } else {
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
          const day = now.getDate();
          const uploadPath = path.join(
            process.cwd(),
            '/upload',
            `${year}/${month}/${day}`,
          );
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (_req, file, cb) => {
          const originalname = Buffer.from(
            file.originalname,
            'latin1',
          ).toString('utf8');
          cb(
            null,
            `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(originalname)}`,
          );
        },
      }),
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
