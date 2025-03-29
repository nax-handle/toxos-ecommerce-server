import { User } from 'src/modules/user/entities/user.entity';
import { slug } from 'src/utils/slug.util';
import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  BeforeInsert,
  JoinColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('Shop')
export class Shop {
  @PrimaryColumn()
  id: string;

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

  @Column()
  userId: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @BeforeInsert()
  generateId(): void {
    if (!this.id) {
      this.id = uuidv4();
    }
  }

  @BeforeInsert()
  createSlug() {
    if (!this.slug) {
      this.slug = slug(this.name);
    }
  }
}
