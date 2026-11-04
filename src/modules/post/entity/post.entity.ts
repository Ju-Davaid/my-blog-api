import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PostPinnedEnum, PostStatusEnum } from '../enum/PostEnum.ts';
import Tag from '../../tag/entity/tag.entity.ts';

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

  @ManyToMany(() => Tag, { cascade: true })
  @JoinTable({
    name: 'post_tag',
    joinColumn: { name: 'post_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  tags: Tag[];

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
