import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import Post from './entity/post.entity.ts';
import { InjectRepository } from '@nestjs/typeorm';
import PostListDTO from './dto/postList.dto.ts';
import PageVO from '../../common/vo/page.vo.ts';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
  ) {}

  public async getList(dto: PostListDTO) {
    const { pageSize, pageNum } = dto;
    const posts = await this.postRepository.find({
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
    });
    const total = await this.postRepository.count();
    return new PageVO<Post>({
      list: posts,
      total,
      pageSize,
      pageNum,
    });
  }
}
