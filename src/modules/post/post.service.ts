import { BadRequestException, Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import Post from './entity/post.entity.ts';
import Tag from '../tag/entity/tag.entity.ts';
import { InjectRepository } from '@nestjs/typeorm';
import PostListDTO from './dto/postList.dto.ts';
import PageVO from '../../common/vo/page.vo.ts';
import CreatePostDTO from './dto/createPost.dto.ts';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PostService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectRepository(Tag) private readonly tagRepository: Repository<Tag>,
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
      relations: { tags: true },
      order: {
        createdAt: 'DESC',
        pinned: 'DESC',
      },
    });
    posts.forEach((item) => {
      item.cover = `${this.configService.get('url')}:${this.configService.get('port')}${item.cover}`;
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
   * 创建或更新文章
   * @param dto 创建或更新文章参数
   * @returns 创建或更新文章结果
   */
  public async createOrUpdate(dto: CreatePostDTO) {
    const { tags: dtoTags = [], cover, ...rest } = dto;
    const coverPath = URL.canParse(cover) ? new URL(cover).pathname : cover;
    const tags = dtoTags.length
      ? await this.tagRepository.findBy({
          id: In(dtoTags.map((item) => item.id)),
        })
      : [];
    if (tags.length !== dtoTags.length) {
      throw new BadRequestException('存在无效的标签ID');
    }
    return await this.postRepository.save({ ...rest, cover: coverPath, tags });
  }

  /**
   * 获取文章详情
   * @param id 文章ID
   * @returns 文章详情
   */
  public async findOne(id: number): Promise<Post | null> {
    const targetPost = await this.postRepository.findOne({
      where: { id },
      relations: { tags: true },
    });
    if (targetPost) {
      return {
        ...targetPost,
        cover: `${this.configService.get('url')}:${this.configService.get('port')}${targetPost.cover}`,
      };
    }
    return null;
  }

  public async delete(id: number) {
    await this.postRepository.delete(id);
  }
}
