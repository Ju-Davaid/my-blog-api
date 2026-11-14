import { Module } from '@nestjs/common';
import { MomentService } from './moment.service.js';
import { MomentController } from './moment.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import Moment from './entity/moment.entity.ts';
import { PhotoModule } from '../photo/photo.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([Moment]), PhotoModule],
  controllers: [MomentController],
  providers: [MomentService],
  exports: [TypeOrmModule],
})
export class MomentModule {}
