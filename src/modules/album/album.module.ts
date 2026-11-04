import { Module } from '@nestjs/common';
import { AlbumService } from './album.service.js';
import { AlbumController } from './album.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import Album from './entity/album.entity.ts';
import Photo from './entity/photo.entity.ts';
import { UploadModule } from '../upload/upload.module.ts';

@Module({
  imports: [TypeOrmModule.forFeature([Album, Photo]), UploadModule],
  controllers: [AlbumController],
  providers: [AlbumService],
  exports: [TypeOrmModule],
})
export class AlbumModule {}
