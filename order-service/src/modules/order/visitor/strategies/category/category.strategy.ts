import { CATEGORY_RATING } from 'src/constants/cashback-rating';
import { CashBackStrategy } from './factory';
import { OrderItem } from 'src/modules/order/entities/order.entity';

export class MensFashionCashBackStrategy implements CashBackStrategy {
  calculate(product: OrderItem): number {
    return product.totalPrice * CATEGORY_RATING.MENS;
  }
}
export class DefaultCashBackStrategy implements CashBackStrategy {
  calculate(product: OrderItem): number {
    return product.totalPrice * 0;
  }
}
