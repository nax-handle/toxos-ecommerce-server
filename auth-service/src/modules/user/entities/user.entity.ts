import { Address } from 'src/modules/address/entities/address.entity';
import { CashbackHistory } from 'src/modules/cashback/entities/cashback.entity';
import { Shop } from 'src/modules/shop/entities/shop.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('User')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @Column({ default: 0 })
  cashbackBalance: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @BeforeInsert()
  generateId(): void {
    this.id = uuidv4();
  }

  @BeforeInsert()
  setUsername() {
    if (!this.username && this.email) {
      this.username = this.email.split('@')[0];
    }
  }
  @OneToMany(() => Address, (address) => address.user)
  addresses: Address[];

  @OneToMany(() => CashbackHistory, (cashback) => cashback.user)
  cashbackHistory: CashbackHistory[];
}
