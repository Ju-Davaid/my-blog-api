import { BadRequestException, Injectable } from '@nestjs/common';
import CreateAlbumDTO from './dto/createAlbum.dto.ts';
import Album from './entity/album.entity.ts';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import AddPhotoDTO from './dto/addPhoto.dto.ts';
import GetPhotoFromAlbumDTO from './dto/getPhotoFromAlbum.dto.ts';
import PageVO from '../../common/vo/page.vo.ts';
import DeletePhotoFromAlbumDTO from './dto/deletePhotoFromAlbum.dto.ts';
import { PhotoService } from '../photo/photo.service.js';
import PhotoTarget from '../photo/enum/photo-target.enum.ts';

@Injectable()
export class AlbumService {
  constructor(
    private readonly photoService: PhotoService,
    private readonly dataSource: DataSource,
    @InjectRepository(Album)
    private readonly albumRepository: Repository<Album>,
  ) {}

  /**
   * 创建相册
   * @param dto
   * @returns 相册实体
   */
  public async create(dto: CreateAlbumDTO) {
    return await this.albumRepository.save(dto);
  }

  /**
   * 获取所有相册（照片数量与封面由 photo 模块统一提供）
   * @returns 相册列表
   */
  public async list() {
    const albums = await this.albumRepository.find();
    const photoGroups = await this.photoService.groupByTargetIds(
      PhotoTarget.Album,
      albums.map((album) => album.id),
    );
    return albums
      .map((album) => {
        const photos = photoGroups.get(album.id) ?? [];
        return {
          id: album.id,
          name: album.name,
          desc: album.desc,
          createAt: album.createdAt,
          updateAt: album.updatedAt,
          count: photos.length,
          cover: photos.length ? this.photoService.toUrl(photos[0].path) : '',
        };
      })
      .sort((a, b) => {
        const d1 = new Date(a.createAt);
        const d2 = new Date(b.createAt);
        return d1.getTime() - d2.getTime();
      });
  }

  /**
   * 删除相册，同时清理其名下全部照片
   * @param id 相册id
   */
  public async delete(id: number) {
    await this.dataSource.transaction(async (manager) => {
      await this.photoService.deleteByTarget(PhotoTarget.Album, id, manager);
      await manager.getRepository(Album).delete(id);
    });
  }

  /**
   * 添加照片到相册
   * @param dto
   * @returns 照片实体
   */
  public async addPhoto(dto: AddPhotoDTO) {
    const album = await this.albumRepository.findOne({
      where: {
        id: dto.albumId,
      },
    });
    if (!album) {
      throw new BadRequestException('相册不存在');
    }
    const photo = await this.photoService.uploadAndCreate(
      PhotoTarget.Album,
      dto.albumId,
      dto.file,
      dto.md5,
    );
    return this.photoService.toVO(photo);
  }

  /**
   * 获取相册下的所有照片
   * @param dto
   * @returns 照片列表
   */
  public async getPhotoFromAlbum(dto: GetPhotoFromAlbumDTO) {
    const { pageNum, pageSize, id } = dto;
    const page = await this.photoService.findPage(
      PhotoTarget.Album,
      id,
      pageNum,
      pageSize,
    );
    // 保留 albumId 字段，兼容既有前端调用
    return new PageVO({
      pageNum: page.pageNum,
      pageSize: page.pageSize,
      total: page.total,
      list: page.list.map((photo) => ({ ...photo, albumId: id })),
    });
  }

  /**
   * 删除相册下的照片
   * @param dto
   */
  public async deletePhotoFromAlbum(dto: DeletePhotoFromAlbumDTO) {
    const { albumId, photoId } = dto;
    await this.photoService.deleteOne(PhotoTarget.Album, albumId, photoId);
  }
}
