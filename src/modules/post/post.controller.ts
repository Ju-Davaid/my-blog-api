import { Controller, Get, Post, Query } from '@nestjs/common';
import { PostService } from './post.service.ts';
import { Public } from '../../common/decorator/auth.decorator.ts';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import PostListDTO from './dto/postList.dto.ts';

@Public()
@ApiTags('文章模块')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('list')
  @ApiOperation({ summary: '获取文章列表' })
  findAll(@Query() dto: PostListDTO) {
    return this.postService.getList(dto);
  }

  @Post('create')
  @ApiOperation({ summary: '创建文章' })
  create() {
    return null;
  }
}
