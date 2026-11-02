import { Controller, Get, Post, Body } from '@nestjs/common';
import { TagService } from './tag.service.ts';
import CreateTagDTO from './dto/createTag.dto.ts';
import UpdateTagDTO from './dto/updateTag.dto.ts';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public, Role } from '../../common/decorator/auth.decorator.ts';
import RoleEnum from '../../common/enum/role.enum.ts';

@Controller('tag')
@ApiTags('标签模块')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Public()
  @Get('list')
  @ApiOperation({ summary: '获取所有标签' })
  findAll() {
    return this.tagService.findAll();
  }

  @Post('create')
  @Role(RoleEnum.Admin)
  @ApiOperation({ summary: '创建标签' })
  create(@Body() createTagDto: CreateTagDTO) {
    return this.tagService.create(createTagDto);
  }
}
