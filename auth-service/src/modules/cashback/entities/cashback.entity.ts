import { User } from 'src/modules/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('cashback_history')
export class CashbackHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (user) => user.cashbackHistory, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  amount: number;

  @Column({
    type: 'varchar',
    length: 50,
  })
  type: string;

  @Column({ type: 'json', nullable: true })
  orderIds?: string[];

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: Date;
}
