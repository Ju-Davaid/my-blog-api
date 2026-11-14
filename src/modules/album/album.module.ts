import { Module } from '@nestjs/common';
import { AlbumService } from './album.service.js';
import { AlbumController } from './album.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import Album from './entity/album.entity.ts';
import { PhotoModule } from '../photo/photo.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([Album]), PhotoModule],
  controllers: [AlbumController],
  providers: [AlbumService],
  exports: [TypeOrmModule],
})
export class AlbumModule {}
