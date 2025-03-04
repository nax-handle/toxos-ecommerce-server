import { User } from 'src/modules/user/entities/user.entity';
import { Role } from './role.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';

@Entity('UserRole')
export class UserRole {
  @PrimaryGeneratedColumn()
  id: number;
  @OneToOne(() => User, (user) => user)
  user: User;
  @OneToOne(() => Role, (role) => role)
  role: Role;
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
