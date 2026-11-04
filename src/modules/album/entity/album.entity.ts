import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import Photo from './photo.entity.ts';

@Entity({
  name: 'album',
  comment: '相册',
})
class Album {
  @PrimaryGeneratedColumn({
    name: 'id',
    comment: '相册ID',
  })
  id: number;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 10,
    comment: '相册名称',
  })
  name: string;

  @Column({
    name: 'desc',
    type: 'varchar',
    length: 50,
    comment: '相册描述',
  })
  desc: string;
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

  @OneToMany(() => Photo, (photo) => photo.album, {
    cascade: true,
  })
  photos: Photo[];
}

export default Album;
