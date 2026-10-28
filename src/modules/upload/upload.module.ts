import { Module } from '@nestjs/common';
import { UploadService } from './upload.service.ts';
import { UploadController } from './upload.controller.ts';

@Module({
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
