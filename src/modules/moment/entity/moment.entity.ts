import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export default Moment;
