import { BadRequestException, Injectable } from '@nestjs/common';
import CreateTagDTO from './dto/createTag.dto.ts';
import UpdateTagDTO from './dto/updateTag.dto.ts';
import { Repository } from 'typeorm';
import Tag from './entity/tag.entity.ts';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag) private readonly tagRepository: Repository<Tag>,
  ) {}

  public async create(createTagDto: CreateTagDTO) {
    const tag = await this.tagRepository.findOne({
      where: {
        name: createTagDto.name,
      },
    });
    if (tag) {
      throw new BadRequestException('标签名称已存在');
    }
    return await this.tagRepository.save(createTagDto);
  }

  public async findAll() {
    const rows = await this.tagRepository
      .createQueryBuilder('tag')
      .leftJoin('post_tag', 'pt', 'pt.tag_id = tag.id')
      .select('tag.id', 'id')
      .addSelect('tag.name', 'name')
      .addSelect('tag.hue', 'hue')
      .addSelect('COUNT(pt.post_id)', 'count')
      .groupBy('tag.id')
      .getRawMany<Tag>();
    return rows.map((row) => ({ ...row, count: Number(row.count) }));
  }
  public async remove(id: number) {
    return await this.tagRepository.delete(id);
  }
}
