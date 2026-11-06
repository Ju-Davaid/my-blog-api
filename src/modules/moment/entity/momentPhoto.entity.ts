import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import Moment from './moment.entity.ts';

@Entity({ name: 'moment_photo', comment: '动态照片表' })
class MomentPhoto {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Moment, (moment) => moment.photos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'moment_id' })
  moment: Relation<Moment>;

  @Column({
    type: 'varchar',
    comment: '缩略图url',
    length: 255,
    default: '',
  })
  thumbUrl: string;

  @Column({
    type: 'varchar',
    comment: '原图url',
    length: 255,
    default: '',
  })
  fullUrl: string;

  @Column({
    type: 'int',
    comment: '排序',
    default: 0,
  })
  sort: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export default MomentPhoto;
