import { OrderItem } from '../../entities/order.entity';
import { CashBackStrategy } from './strategy';
import { CATEGORY_RATING } from 'src/constants/cashback-rating';

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
