import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import Post from '../../post/entity/post.entity.ts';

@Entity({ name: 'tag', comment: '标签表' })
class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20, comment: '标签名称' })
  name: string;

  @Column({ length: 20, comment: '标签颜色' })
  hue: string;

  /** 引用此标签的文章数量（查询时通过关联统计填充，不落库） */
  count: number;

  @ManyToMany(() => Post, (post) => post.tags)
  posts: Post[];
}
export default Tag;
