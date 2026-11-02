import { Injectable } from '@nestjs/common';
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

  create(createTagDto: CreateTagDTO) {
    return this.tagRepository.save(createTagDto);
  }

  findAll() {
    return this.tagRepository.find();
  }
  remove(id: number) {
    return this.tagRepository.delete(id);
  }
}
