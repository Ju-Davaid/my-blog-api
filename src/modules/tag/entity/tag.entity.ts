import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'tag', comment: '标签表' })
class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20, comment: '标签名称' })
  name: string;

  @Column({ length: 20, comment: '标签颜色' })
  hue: string;
}
export default Tag;
