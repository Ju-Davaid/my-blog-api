import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PostPinnedEnum, PostStatusEnum } from '../enum/PostEnum.ts';

@Entity({
  name: 'post',
  comment: '文章',
})
class Post {
  @PrimaryGeneratedColumn('increment', { comment: '文章Id' })
  id: number;

  @Column({
    name: 'title',
    comment: '文章标题',
    type: 'varchar',
    nullable: false,
    length: 100,
  })
  title: string;

  @Column({
    name: 'desc',
    comment: '文章描述',
    type: 'varchar',
    nullable: true,
    default: '',
    length: 200,
  })
  desc: string;

  @Column({
    name: 'content',
    comment: '文章内容',
    type: 'longtext',
  })
  content: string;

  @Column({
    name: 'cover',
    comment: '文章封面',
    type: 'varchar',
    nullable: true,
    default: '',
  })
  cover: string;

  @Column({
    name: 'pinned',
    comment: '是否置顶 0:否 1:是',
    type: 'tinyint',
    default: PostPinnedEnum.No,
  })
  pinned: number;

  @Column({
    name: 'status',
    comment: '文章状态 0:草稿 1:已发布',
    type: 'tinyint',
    default: PostStatusEnum.Draft,
  })
  status: number;

  @Column({
    name: 'publish_time',
    comment: '发布时间',
    type: 'datetime',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  publishTime: Date;

  @Column({
    name: 'category_id',
    comment: '分类ID',
    type: 'int',
    default: null,
  })
  categoryId: number | null;

  @Column({
    name: 'tag_ids',
    comment: '标签ID列表',
    type: 'varchar',
    nullable: true,
    default: '',
  })
  tagIds: string;

  @Column({
    name: 'views',
    comment: '文章浏览量',
    type: 'int',
    default: 0,
  })
  views: number;

  @CreateDateColumn({
    name: 'created_at',
    comment: '创建时间',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    comment: '更新时间',
  })
  updatedAt: Date;
}

export default Post;
