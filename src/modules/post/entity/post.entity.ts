import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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
    length: 200,
  })
  title: string;

  @Column({
    name: 'desc',
    comment: '文章描述',
    type: 'varchar',
    nullable: true,
    default: '',
    length: 500,
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
    length: 200,
  })
  cover: string;

  @Column({
    name: 'pinned',
    comment: '是否置顶 0:否 1:是',
    type: 'tinyint',
    default: 0,
  })
  pinned: number;

  @Column({
    name: 'status',
    comment: '文章状态 0:草稿 1:已发布',
    type: 'tinyint',
    default: 0,
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
