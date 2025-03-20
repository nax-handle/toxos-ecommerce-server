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
    comment: 'Số tiền cashback',
  })
  amount: number;

  @Column({
    type: 'varchar',
    length: 50,
    comment: 'Loại cashback: order, promotion, refund...',
  })
  type: string;

  @Column({ type: 'text', array: true, nullable: true })
  orderIds?: string[];

  @CreateDateColumn({
    type: 'timestamp',
    comment: 'Thời điểm cashback được ghi nhận',
  })
  createdAt: Date;
}
