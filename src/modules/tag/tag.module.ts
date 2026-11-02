import { Module } from '@nestjs/common';
import { TagService } from './tag.service.ts';
import { TagController } from './tag.controller.ts';
import { TypeOrmModule } from '@nestjs/typeorm';
import Tag from './entity/tag.entity.ts';

@Module({
  imports: [TypeOrmModule.forFeature([Tag])],
  controllers: [TagController],
  providers: [TagService],
  exports: [TypeOrmModule],
})
export class TagModule {}
