import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import PhotoTarget from '../enum/photo-target.enum.ts';

/**
 * 统一照片表
 *
 * 相册照片与动态照片共用本表，通过 target 区分业务来源，
 * targetId 记录归属的相册 / 动态 ID（多态关联，不建立物理外键）。
 */
@Entity({
  name: 'photo',
  comment: '照片',
})
@Index('idx_photo_target', ['target', 'targetId', 'sort'])
class Photo {
  @PrimaryGeneratedColumn({
    name: 'id',
    comment: '照片ID',
  })
  id: number;

  @Column({
    name: 'target',
    type: 'varchar',
    length: 20,
    comment: '归属类型: album | moment',
  })
  target: PhotoTarget;

  @Column({
    name: 'target_id',
    type: 'int',
    comment: '归属记录ID(album.id / moment.id)',
  })
  targetId: number;

  @Column({
    name: 'path',
    type: 'varchar',
    length: 255,
    comment: '原图路径',
  })
  path: string;

  @Column({
    name: 'thumb_path',
    type: 'varchar',
    length: 255,
    default: '',
    comment: '缩略图路径',
  })
  thumbPath: string;

  @Column({
    name: 'sort',
    type: 'int',
    default: 0,
    comment: '排序(相册照片固定为0)',
  })
  sort: number;

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

export default Photo;
