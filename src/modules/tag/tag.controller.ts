import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { TagService } from './tag.service.ts';
import CreateTagDTO from './dto/createTag.dto.ts';
import UpdateTagDTO from './dto/updateTag.dto.ts';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Public, Role } from '../../common/decorator/auth.decorator.ts';
import RoleEnum from '../../common/enum/role.enum.ts';
import DeleteTagDTO from './dto/deleteTag.dto.ts';

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
  @ApiBearerAuth()
  @Role(RoleEnum.Admin)
  @ApiOperation({ summary: '创建标签' })
  create(@Body() createTagDto: CreateTagDTO) {
    return this.tagService.create(createTagDto);
  }

  @Get('delete')
  @ApiBearerAuth()
  @Role(RoleEnum.Admin)
  @ApiOperation({ summary: '删除标签' })
  delete(@Query() deleteTagDto: DeleteTagDTO) {
    return this.tagService.remove(deleteTagDto.id);
  }
}
