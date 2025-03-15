import { OrderItem } from 'src/modules/order/entities/order.entity';
import {
  DefaultCashBackStrategy,
  MensFashionCashBackStrategy,
} from './category.strategy';

export interface CashBackStrategy {
  calculate(orderItem: OrderItem): number;
}

export class CategoryStrategyFactory {
  private static strategies: Map<string, CashBackStrategy> = new Map([
    ['mens-fashion', new MensFashionCashBackStrategy()],
  ]);

  static getStrategy(category: string): CashBackStrategy {
    return this.strategies.get(category) || new DefaultCashBackStrategy();
  }
}
