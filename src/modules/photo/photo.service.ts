import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In, Repository } from 'typeorm';
import Photo from './entity/photo.entity.ts';
import PhotoTarget from './enum/photo-target.enum.ts';
import { UploadService } from '../upload/upload.service.ts';
import PageVO from '../../common/vo/page.vo.ts';

/** 创建一条照片记录所需的业务数据 */
export interface CreatePhotoInput {
  path: string;
  thumbPath?: string;
  sort?: number;
}

/**
 * 照片统一管理服务
 *
 * 所有照片的落库、查询、删除与 URL 拼接均收敛在此处，
 * album / moment 模块通过注入本服务操作照片，不再直接持有 Repository。
 */
@Injectable()
export class PhotoService {
  constructor(
    @InjectRepository(Photo)
    private readonly photoRepository: Repository<Photo>,
    private readonly configService: ConfigService,
    private readonly uploadService: UploadService,
  ) {}

  /** 把静态资源相对路径拼接为可访问的完整地址 */
  public toUrl(path?: string) {
    return path
      ? `${this.configService.get('app.url')}:${this.configService.get('app.port')}${path}`
      : '';
  }

  /** 统一照片视图：返回完整 URL */
  public toVO(photo: Photo) {
    const { id, target, targetId, sort, createdAt, updatedAt } = photo;
    return {
      id,
      target,
      targetId,
      sort,
      createdAt,
      updatedAt,
      path: this.toUrl(photo.path),
      thumbPath: this.toUrl(photo.thumbPath),
    };
  }

  /** 上传单个文件并落库（相册照片入口） */
  public async uploadAndCreate(
    target: PhotoTarget,
    targetId: number,
    file: Express.Multer.File | undefined,
    md5: string,
    extra?: Omit<CreatePhotoInput, 'path'>,
  ) {
    const path = this.uploadService.handleSingleUpload(file, md5);
    return await this.create(target, targetId, { ...extra, path });
  }

  /** 创建单条照片记录 */
  public async create(
    target: PhotoTarget,
    targetId: number,
    input: CreatePhotoInput,
  ) {
    return await this.photoRepository.save(
      this.photoRepository.create({ target, targetId, ...input }),
    );
  }

  /** 批量创建照片记录（动态照片入口） */
  public async createMany(
    target: PhotoTarget,
    targetId: number,
    inputs: CreatePhotoInput[],
  ) {
    if (!inputs.length) return [];
    const entities = inputs.map((input) =>
      this.photoRepository.create({ target, targetId, ...input }),
    );
    return await this.photoRepository.save(entities);
  }

  /** 按归属分页查询，结果已拼接完整 URL */
  public async findPage(
    target: PhotoTarget,
    targetId: number,
    pageNum: number,
    pageSize: number,
  ) {
    const [list, total] = await this.photoRepository.findAndCount({
      where: { target, targetId },
      order: { sort: 'ASC', id: 'ASC' },
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
    });
    return new PageVO({
      pageNum,
      pageSize,
      total,
      list: list.map((photo) => this.toVO(photo)),
    });
  }

  /**
   * 批量按归属查询，按 targetId 分组返回
   * 用于列表场景一次性取回所有照片，避免 N+1 查询
   */
  public async groupByTargetIds(target: PhotoTarget, targetIds: number[]) {
    const groups = new Map<number, Photo[]>();
    if (!targetIds.length) return groups;
    const photos = await this.photoRepository.find({
      where: { target, targetId: In(targetIds) },
      order: { sort: 'ASC', id: 'ASC' },
    });
    for (const photo of photos) {
      const group = groups.get(photo.targetId) ?? [];
      group.push(photo);
      groups.set(photo.targetId, group);
    }
    return groups;
  }

  /** 删除指定归属下的单张照片 */
  public async deleteOne(
    target: PhotoTarget,
    targetId: number,
    photoId: number,
  ) {
    return await this.photoRepository.delete({ id: photoId, target, targetId });
  }

  /**
   * 删除指定归属下的全部照片（删除相册 / 动态时调用）
   * 传入 manager 时加入调用方的事务，保证与主体删除的原子性
   */
  public async deleteByTarget(
    target: PhotoTarget,
    targetId: number,
    manager?: EntityManager,
  ) {
    const repository = manager
      ? manager.getRepository(Photo)
      : this.photoRepository;
    return await repository.delete({ target, targetId });
  }
}
