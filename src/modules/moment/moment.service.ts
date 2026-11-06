import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Moment from './entity/moment.entity.ts';
import MomentPhoto from './entity/momentPhoto.entity.ts';
import CreateMomentDTO from './dto/createMoment.dto.ts';
import { ConfigService } from '@nestjs/config';
import GetMomentListDTO from './dto/getMomentList.dto.ts';
import PageVO from '../../common/vo/page.vo.ts';

@Injectable()
export class MomentService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Moment)
    private readonly momentRepository: Repository<Moment>,
    @InjectRepository(MomentPhoto)
    private readonly momentPhotoRepository: Repository<MomentPhoto>,
  ) {}

  /**
   * 创建动态
   * @param dto
   * @returns 动态实体
   */
  public async create(dto: CreateMomentDTO) {
    const newMoment = await this.momentRepository.save({
      content: dto.content,
      category: dto.category,
      photos: dto.urls.map((url, index) => {
        const fullUrl = new URL(url).pathname;
        console.log(fullUrl);
        return {
          fullUrl: fullUrl,
          sort: index + 1,
        };
      }),
    });
    newMoment.photos = newMoment.photos.map((photo) => ({
      ...photo,
      fullUrl: `${this.configService.get('app.url')}:${this.configService.get('app.port')}${photo.fullUrl}`,
    }));
    return newMoment;
  }

  /**
   * 获取所有动态
   * @param dto
   * @returns 动态列表
   */
  public async list(dto: GetMomentListDTO) {
    const { pageNum, pageSize } = dto;
    const moments = await this.momentRepository.find({
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
      relations: {
        photos: true,
      },
    });
    const total = await this.momentRepository.count();
    return new PageVO({
      pageNum,
      pageSize,
      total,
      list: moments.map((moment) => ({
        ...moment,
        photos: moment.photos.sort((a, b) => {
          a.fullUrl = `${this.configService.get('app.url')}:${this.configService.get('app.port')}${a.fullUrl}`;
          b.fullUrl = `${this.configService.get('app.url')}:${this.configService.get('app.port')}${b.fullUrl}`;
          return (a.sort ?? 0) - (b.sort ?? 0);
        }),
      })),
    });
  }

  /**
   * 删除动态
   * @param id
   * @returns 删除结果
   */
  public async delete(id: number) {
    return await this.momentRepository.delete(id);
  }
}
