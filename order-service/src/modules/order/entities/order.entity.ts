import { SHIPPING_STATUS } from 'src/constants/shipping-status';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderItem } from './order-item.entity';
import { ORDER_STATUS } from 'src/constants/order-status';
import { PAYMENT_METHOD } from 'src/constants/payment-method';
import { jsonTransformer } from 'src/utils/json-transformer';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false, length: 50 })
  shopId: string;
  @Column({ type: 'varchar', nullable: false, length: 50 })
  userId: string;

  @Column({ type: 'boolean', nullable: false, default: true })
  isReview: boolean;

  @Column({ type: 'text', nullable: false, transformer: jsonTransformer })
  shop: {
    id: string;
    name: string;
    logo: string;
    slug: string;
  };
  @Column({
    type: 'text',
    nullable: false,
    transformer: jsonTransformer,
  })
  address: {
    street: string;
    ward: string;
    district: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    latitude: number;
    longitude: number;
    note: string;
  };

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalShipping: number;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    comment: `Allowed values: ${Object.values(PAYMENT_METHOD).join(', ')}`,
  })
  paymentMethod: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    default: ORDER_STATUS.PENDING,
    comment: `Allowed values: ${Object.values(ORDER_STATUS).join(', ')}`,
  })
  status: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    default: SHIPPING_STATUS.NOT_PACKED,
    comment: `Allowed values: ${Object.values(SHIPPING_STATUS).join(', ')}`,
  })
  shippingStatus: string;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  orderItems: OrderItem[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
