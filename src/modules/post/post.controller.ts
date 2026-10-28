import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PostService } from './post.service.ts';
import { Public, Role } from '../../common/decorator/auth.decorator.ts';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import PostListDTO from './dto/postList.dto.ts';
import RoleEnum from '../../common/enum/role.enum.ts';
import CreatePostDTO from './dto/createPost.dto.ts';

@Public()
@ApiTags('文章模块')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('list')
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取文章列表' })
  findAll(@Query() dto: PostListDTO) {
    return this.postService.getList(dto);
  }

  @Post('create')
  // @Role(RoleEnum.ADMIN)
  @ApiOperation({ summary: '创建文章' })
  @ApiConsumes('multipart/form-data')
  create(@Body() dto: CreatePostDTO) {
    return this.postService.create(dto);
  }
}
