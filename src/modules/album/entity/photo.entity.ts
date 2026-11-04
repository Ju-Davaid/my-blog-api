import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

@Entity({
  name: 'photo',
  comment: '相册',
})
class Photo {
  @PrimaryGeneratedColumn({
    name: 'id',
    comment: '相册ID',
  })
  id: number;
  
  @Column({
    name: 'alum_id',
    comment: '相册ID',
  })
  alumId: number;

  @Column({
    name: 'album_id',
    comment: '相册ID',
  })
  albumId: number;
  @Column({
    name: 'path',
    type: 'varchar',
    length: 255,
    comment: '图片路径',
  })
  path: string;
}

export default Photo;
