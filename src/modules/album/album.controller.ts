import { Controller, Post, Body } from '@nestjs/common';
import { AlbumService } from './album.service.js';
import CreateAlbumDTO from './dto/createAlbum.dto.ts';
import { Role } from '../../common/decorator/auth.decorator.ts';
import RoleEnum from '../../common/enum/role.enum.ts';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('album')
@ApiTags('相册模块')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Post('create')
  @ApiBearerAuth()
  @Role(RoleEnum.Admin)
  @ApiOperation({ summary: '创建相册' })
  public async create(@Body() dto: CreateAlbumDTO) {
    return await this.albumService.create(dto);
  }
}
