import { Injectable } from '@nestjs/common';
import { LoyaltyPointsCalculator } from './visitor/caculator-loyalty-points';
import { OrderVisitor } from './visitor/order';

@Injectable()
export class OrderService {
  getOrders() {
    return {
      totalPrice: 300,
      products: [
        { price: 100, category: 'toy' },
        { price: 200, category: 'mens-fashion' },
      ],
    };
  }
  calculateLoyaltyPoints() {
    const orders = this.getOrders();
    const order = new OrderVisitor(orders);
    const loyaltyCalculator = new LoyaltyPointsCalculator();
    return order.getTotalLoyaltyPoints(loyaltyCalculator);
  }
}
