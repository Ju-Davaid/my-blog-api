import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AlbumService } from './album.service.js';
import CreateAlbumDTO from './dto/createAlbum.dto.ts';
import { Public, Role } from '../../common/decorator/auth.decorator.ts';
import RoleEnum from '../../common/enum/role.enum.ts';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ParseIntPipe } from '@nestjs/common';
import DeleteAlbumDTO from './dto/deleteAlbum.dto.ts';
import AddPhotoDTO from './dto/addPhoto.dto.ts';
import { FileInterceptor } from '@nestjs/platform-express';
import GetPhotoFromAlbumDTO from './dto/getPhotoFromAlbum.dto.ts';
import DeletePhotoFromAlbumDTO from './dto/deletePhotoFromAlbum.dto.ts';

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

  @Public()
  @Get('list')
  @ApiOperation({ summary: '获取相册列表' })
  public async list() {
    return await this.albumService.list();
  }

  @Get('delete')
  @ApiBearerAuth()
  @Role(RoleEnum.Admin)
  @ApiOperation({ summary: '删除相册' })
  public async delete(@Query() dto: DeleteAlbumDTO) {
    await this.albumService.delete(dto.id);
  }

  @Post('addPhoto')
  @ApiBearerAuth()
  @Role(RoleEnum.Admin)
  @ApiBody({ type: AddPhotoDTO })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: '添加相册照片' })
  public async addPhoto(
    @Body() dto: AddPhotoDTO,
    @UploadedFile() file: Express.Multer.File,
  ) {
    dto.file = file;
    return await this.albumService.addPhoto(dto);
  }

  @Public()
  @Get('getPhotoFromAlbum')
  @ApiOperation({ summary: '获取相册照片' })
  public async getPhotoFromAlbum(@Query() dto: GetPhotoFromAlbumDTO) {
    return await this.albumService.getPhotoFromAlbum(dto);
  }

  @ApiBearerAuth()
  @Role(RoleEnum.Admin)
  @ApiOperation({ summary: '删除相册照片' })
  @Get('deletePhotoFromAlbum')
  public async deletePhotoFromAlbum(@Query() dto: DeletePhotoFromAlbumDTO) {
    await this.albumService.deletePhotoFromAlbum(dto);
  }
}
