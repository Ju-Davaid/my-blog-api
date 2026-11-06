import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import MomentPhoto from './momentPhoto.entity.ts';

@Entity({ name: 'moment', comment: '动态表' })
class Moment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    comment: '分类',
    length: 10,
    default: '',
    nullable: true,
  })
  category: string;

  @Column({
    type: 'longtext',
    comment: '内容内容',
  })
  content: string;

  @Column({
    type: 'int',
    comment: '点赞数',
    default: 0,
  })
  likeCount: number;

  @OneToMany(() => MomentPhoto, (momentPhoto) => momentPhoto.moment, {
    cascade: true,
  })
  photos: Relation<Partial<MomentPhoto>>[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export default Moment;
