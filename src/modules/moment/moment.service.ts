import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import Moment from './entity/moment.entity.ts';
import CreateMomentDTO from './dto/createMoment.dto.ts';
import GetMomentListDTO from './dto/getMomentList.dto.ts';
import PageVO from '../../common/vo/page.vo.ts';
import Photo from '../photo/entity/photo.entity.ts';
import PhotoTarget from '../photo/enum/photo-target.enum.ts';
import { PhotoService } from '../photo/photo.service.js';

@Injectable()
export class MomentService {
  constructor(
    private readonly photoService: PhotoService,
    private readonly dataSource: DataSource,
    @InjectRepository(Moment)
    private readonly momentRepository: Repository<Moment>,
  ) {}

  /**
   * 创建动态，照片由 photo 模块统一落库
   * @param dto
   * @returns 动态实体
   */
  public async create(dto: CreateMomentDTO) {
    const moment = await this.momentRepository.save({
      content: dto.content,
      category: dto.category,
    });
    const photos = await this.photoService.createMany(
      PhotoTarget.Moment,
      moment.id,
      dto.urls.map((url, index) => ({
        path: new URL(url).pathname,
        sort: index + 1,
      })),
    );
    return this.toMomentVO(moment, photos);
  }

  /**
   * 获取所有动态，照片一次性批量查询避免 N+1
   * @param dto
   * @returns 动态列表
   */
  public async list(dto: GetMomentListDTO) {
    const { pageNum, pageSize } = dto;
    const moments = await this.momentRepository.find({
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
    });
    const total = await this.momentRepository.count();
    const photoGroups = await this.photoService.groupByTargetIds(
      PhotoTarget.Moment,
      moments.map((moment) => moment.id),
    );
    return new PageVO({
      pageNum,
      pageSize,
      total,
      list: moments.map((moment) =>
        this.toMomentVO(moment, photoGroups.get(moment.id) ?? []),
      ),
    });
  }

  /**
   * 删除动态，同时清理其名下全部照片
   * @param id
   * @returns 删除结果
   */
  public async delete(id: number) {
    return await this.dataSource.transaction(async (manager) => {
      await this.photoService.deleteByTarget(PhotoTarget.Moment, id, manager);
      return await manager.getRepository(Moment).delete(id);
    });
  }

  /** 动态视图：主体字段 + 由 photo 模块统一管理的照片列表 */
  private toMomentVO(moment: Moment, photos: Photo[]) {
    const { id, category, content, likeCount, createdAt, updatedAt } = moment;
    return {
      id,
      category,
      content,
      likeCount,
      createdAt,
      updatedAt,
      photos: photos.map((photo) => this.toMomentPhotoVO(photo)),
    };
  }

  /** 统一照片实体 → 动态照片视图，保留原有 fullUrl / thumbUrl 字段 */
  private toMomentPhotoVO(photo: Photo) {
    return {
      id: photo.id,
      fullUrl: this.photoService.toUrl(photo.path),
      thumbUrl: this.photoService.toUrl(photo.thumbPath),
      sort: photo.sort,
      createdAt: photo.createdAt,
      updatedAt: photo.updatedAt,
    };
  }
}
