import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import Post from './entity/post.entity.ts';
import { InjectRepository } from '@nestjs/typeorm';
import PostListDTO from './dto/postList.dto.ts';
import PageVO from '../../common/vo/page.vo.ts';
import CreatePostDTO from './dto/createPost.dto.ts';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
  ) {}

  /**
   * 获取文章列表
   * @param dto 查询参数
   * @returns 文章列表
   */
  public async getList(dto: PostListDTO) {
    const { pageSize, pageNum } = dto;
    const posts = await this.postRepository.find({
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
      order: {
        createdAt: 'DESC',
        pinned: 'DESC',
      },
    });
    const total = await this.postRepository.count();
    return new PageVO<Post>({
      list: posts,
      total,
      pageSize,
      pageNum,
    });
  }

  /**
   * 创建文章
   * @param dto 创建文章参数
   * @returns 创建文章结果
   */
  public async create(dto: CreatePostDTO) {
    return await this.postRepository.save(dto);
  }

  /**
   * 获取文章详情
   * @param id 文章ID
   * @returns 文章详情
   */
  public async findOne(id: number) {
    return await this.postRepository.findOne({
      where: { id },
    });
  }
}
