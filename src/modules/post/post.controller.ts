import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service.ts';
import { Public, Role } from '../../common/decorator/auth.decorator.ts';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import PostListDTO from './dto/postList.dto.ts';
import RoleEnum from '../../common/enum/role.enum.ts';
import CreatePostDTO from './dto/createPost.dto.ts';

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

  @Get(':id')
  @ApiOperation({ summary: '获取文章详情' })
  async getPost(
    @Param(
      'id',
      new ParseIntPipe({
        exceptionFactory(error) {
          return new BadRequestException('文章ID必须是数字');
        },
      }),
    )
    id: number,
  ) {
    return this.postService.findOne(id);
  }

  @Post('createOrUpdate')
  @Role(RoleEnum.Admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: '创建或更新文章' })
  @ApiConsumes('multipart/form-data')
  createOrUpdate(@Body() dto: CreatePostDTO) {
    return this.postService.createOrUpdate(dto);
  }

  @Get('delete/:id')
  @ApiBearerAuth()
  @Role(RoleEnum.Admin)
  @ApiOperation({ summary: '删除文章' })
  deletePost(
    @Param(
      'id',
      new ParseIntPipe({
        exceptionFactory(error) {
          return new BadRequestException('文章ID必须是数字');
        },
      }),
    )
    id: number,
  ) {
    return this.postService.delete(id);
  }
}
