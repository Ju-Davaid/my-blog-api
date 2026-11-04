import { Injectable } from '@nestjs/common';
import CreateAlbumDTO from './dto/createAlbum.dto.ts';
import Album from './entity/album.entity.ts';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UploadService } from '../upload/upload.service.ts';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(Album)
    private readonly albumRepository: Repository<Album>,
    private readonly uploadService: UploadService,
  ) {}
  public async create(dto: CreateAlbumDTO) {
    return await this.albumRepository.save(dto);
  }
}
