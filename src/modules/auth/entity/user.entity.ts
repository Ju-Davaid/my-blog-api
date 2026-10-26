import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'user',
  comment: '用户表',
})
class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    name: 'username',
    comment: '用户名',
    type: 'varchar',
    length: 20,
  })
  username: string;

  @Column({
    name: 'password',
    comment: '密码',
    type: 'varchar',
    length: 60,
  })
  password: string;

  @Column({
    name: 'role',
    comment: '角色 0:用户 1:管理员',
    type: 'tinyint',
    default: 0,
  })
  role: number;

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

  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }
}

export default User;
