import { CashBackVisitor } from './visitor.interface';
import { Order } from '../../entities/order.entity';
import { CategoryStrategyFactory } from './strategies/category/factory';
import { PaymentStrategyFactory } from './strategies/payment/factory';
export class CashBackCalculator implements CashBackVisitor {
  visitCategories(order: Order): number {
    return order.orderItems.reduce((total, product) => {
      const strategy = CategoryStrategyFactory.getStrategy(product.category);
      return total + strategy.calculate(product);
    }, 0);
  }
  visitPayment(order: Order): number {
    return PaymentStrategyFactory.getPaymentStrategy(
      order.paymentMethod,
    ).calculate(order);
  }
  visitDefault(order: Order): number {
    return order.totalPrice * 0;
  }
}
