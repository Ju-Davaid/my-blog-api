import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhotoService } from './photo.service.js';
import { PhotoController } from './photo.controller.js';
import Photo from './entity/photo.entity.ts';
import { UploadModule } from '../upload/upload.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([Photo]), UploadModule],
  controllers: [PhotoController],
  providers: [PhotoService],
  exports: [PhotoService, TypeOrmModule],
})
export class PhotoModule {}
