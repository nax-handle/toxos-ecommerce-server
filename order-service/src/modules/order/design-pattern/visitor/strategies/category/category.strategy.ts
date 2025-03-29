import { CATEGORY_RATING } from 'src/constants/cashback-rating';
import { OrderItem } from 'src/modules/order/entities/order-item.entity';
import { CashBackStrategy } from './strategy.interface';

export class MensFashionCashBackStrategy implements CashBackStrategy {
  calculate(product: OrderItem): number {
    return product.getTotal() * CATEGORY_RATING.MENS;
  }
}
export class DefaultCashBackStrategy implements CashBackStrategy {
  calculate(product: OrderItem): number {
    return product.getTotal() * 0;
  }
}
