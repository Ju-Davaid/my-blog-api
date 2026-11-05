import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import Album from './album.entity.ts';

@Entity({
  name: 'photo',
  comment: '照片',
})
class Photo {
  @PrimaryGeneratedColumn({
    name: 'id',
    comment: '照片ID',
  })
  id: number;

  @Column({
    name: 'album_id',
    comment: '相册ID',
  })
  albumId: number;

  @ManyToOne(() => Album, (album) => album.photos, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'album_id',
  })
  album: Relation<Album>;

  @Column({
    name: 'path',
    type: 'varchar',
    length: 255,
    comment: '图片路径',
  })
  path: string;
}

export default Photo;
