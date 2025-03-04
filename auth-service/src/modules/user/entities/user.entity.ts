import { Shop } from 'src/modules/shop/entities/shop.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';

@Entity('User')
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true })
  email: string;
  @Column({ nullable: true })
  phone: string;
  @Column({ unique: true, nullable: true })
  username: string;
  @Column()
  password: string;
  @Column({ nullable: true })
  first_name: string;
  @Column({ nullable: true })
  last_name: string;
  @Column({ nullable: true })
  gender: string;
  @Column({ nullable: true })
  dob: Date;
  @Column({ default: true })
  active: boolean;
  @OneToOne(() => Shop, (shop) => shop.user)
  shop: Shop;
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
