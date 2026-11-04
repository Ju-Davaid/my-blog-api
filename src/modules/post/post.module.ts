import { Module } from '@nestjs/common';
import { PostService } from './post.service.js';
import { PostController } from './post.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import Post from './entity/post.entity.js';
import Tag from '../tag/entity/tag.entity.ts';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Tag])],
  controllers: [PostController],
  providers: [PostService],
  exports: [TypeOrmModule],
})
export class PostModule {}
