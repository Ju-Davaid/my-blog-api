import { Module } from '@nestjs/common';
import { MomentService } from './moment.service.js';
import { MomentController } from './moment.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import Moment from './entity/moment.entity.ts';
import MomentPhoto from './entity/momentPhoto.entity.ts';
import { UploadModule } from '../upload/upload.module.ts';

@Module({
  imports: [TypeOrmModule.forFeature([Moment, MomentPhoto]), UploadModule],
  controllers: [MomentController],
  providers: [MomentService],
  exports: [TypeOrmModule],
})
export class MomentModule {}
