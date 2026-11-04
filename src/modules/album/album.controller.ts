import { Controller, Post, Body } from '@nestjs/common';
import { AlbumService } from './album.service.js';
import CreateAlbumDTO from './dto/createAlbum.dto.ts';
import { Role } from '../../common/decorator/auth.decorator.ts';
import RoleEnum from '../../common/enum/role.enum.ts';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Role(RoleEnum.Admin)
  @Post('create')
  public async create(@Body() dto: CreateAlbumDTO) {
    return await this.albumService.create(dto);
  }
}
