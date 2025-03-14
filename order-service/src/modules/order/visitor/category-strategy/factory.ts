import {
  DefaultCashBackStrategy,
  MensFashionCashBackStrategy,
} from './category.strategy';
import { CashBackStrategy } from './strategy';

export class CategoryStrategyFactory {
  private static strategies: Map<string, CashBackStrategy> = new Map([
    ['mens-fashion', new MensFashionCashBackStrategy()],
  ]);

  static getStrategy(category: string): CashBackStrategy {
    return this.strategies.get(category) || new DefaultCashBackStrategy();
  }
}
