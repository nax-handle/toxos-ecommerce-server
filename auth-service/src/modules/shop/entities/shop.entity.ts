import { User } from 'src/modules/user/entities/user.entity';
import { slug } from 'src/utils/slug.util';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  BeforeInsert,
  JoinColumn,
} from 'typeorm';

@Entity('Shop')
export class Shop {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: false })
  name: string;
  @Column({ unique: true })
  slug: string;
  @Column()
  logo: string;
  @Column()
  description: string;
  @Column({ length: 10 })
  phoneNumber: string;
  @Column()
  address: string;
  @Column()
  detailedAddress: string;
  @OneToOne(() => User, (user) => user.shop, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
  @BeforeInsert()
  createSlug() {
    if (!this.slug) {
      this.slug = slug(this.name);
    }
  }
}
