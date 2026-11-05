import { BadRequestException, Injectable, Param } from '@nestjs/common';
import CreateAlbumDTO from './dto/createAlbum.dto.ts';
import Album from './entity/album.entity.ts';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UploadService } from '../upload/upload.service.ts';
import AddPhotoDTO from './dto/addPhoto.dto.ts';
import Photo from './entity/photo.entity.ts';
import { ConfigService } from '@nestjs/config';
import GetPhotoFromAlbumDTO from './dto/getPhotoFromAlbum.dto.ts';
import PageVO from '../../common/vo/page.vo.ts';
import DeletePhotoFromAlbumDTO from './dto/deletePhotoFromAlbum.dto.ts';

@Injectable()
export class AlbumService {
  constructor(
    private readonly uploadService: UploadService,
    private readonly configService: ConfigService,
    @InjectRepository(Album)
    private readonly albumRepository: Repository<Album>,
    @InjectRepository(Photo)
    private readonly photoRepository: Repository<Photo>,
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
   * 获取所有相册
   * @returns 相册列表
   */
  public async list() {
    const albums = await this.albumRepository
      .createQueryBuilder('album')
      .leftJoinAndSelect('album.photos', 'photo')
      .orderBy('photo.id', 'ASC')
      .getMany();
    const baseUrl = `${this.configService.get('app.url')}:${this.configService.get('app.port')}`;
    return albums
      .map((album) => ({
        id: album.id,
        name: album.name,
        desc: album.desc,
        createAt: album.createdAt,
        updateAt: album.updatedAt,
        count: album.photos.length,
        cover: album.photos.length ? `${baseUrl}${album.photos[0].path}` : '',
      }))
      .sort((a, b) => {
        const d1 = new Date(a.createAt);
        const d2 = new Date(b.createAt);
        return d1.getTime() - d2.getTime();
      });
  }

  /**
   * 删除相册
   * @param id 相册id
   */
  public async delete(id: number) {
    await this.albumRepository.delete(id);
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
    const photoPath = this.uploadService.handleSingleUpload(dto.file, dto.md5);
    const photo = await this.photoRepository.save({
      albumId: dto.albumId,
      path: photoPath,
    });
    return {
      ...photo,
      path: this.getPhotoUrl(photo),
    };
  }

  /**
   * 获取相册下的所有照片
   * @param dto
   * @returns 照片列表
   */
  public async getPhotoFromAlbum(dto: GetPhotoFromAlbumDTO) {
    const { pageNum, pageSize, id } = dto;
    const list = await this.photoRepository.find({
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
      where: {
        albumId: id,
      },
      order: {
        id: 'ASC',
      },
    });
    const total = await this.photoRepository.count({
      where: {
        albumId: id,
      },
    });
    return new PageVO({
      pageNum,
      pageSize,
      total,
      list: list.map((photo) => ({
        ...photo,
        path: this.getPhotoUrl(photo),
      })),
    });
  }
  /**
   * 删除相册下的照片
   * @param dto
   */
  public async deletePhotoFromAlbum(dto: DeletePhotoFromAlbumDTO) {
    const { albumId, photoId } = dto;
    await this.photoRepository.delete({
      albumId,
      id: photoId,
    });
  }
  /**
   * 获取相册下的所有url
   * @param photo 照片实体
   * @returns 照片url路径
   */
  private getPhotoUrl(photo: Photo) {
    return `${this.configService.get('app.url')}:${this.configService.get('app.port')}${photo.path}`;
  }
}
