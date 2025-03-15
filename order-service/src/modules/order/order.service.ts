import { Injectable } from '@nestjs/common';
import { CashBackCalculator } from './visitor/cash-back.visitor';
import { OrderVisitor } from './visitor/order.visitor';

@Injectable()
export class OrderService {
  getOrders() {
    return {
      totalAmount: 500000,
      items: [
        {
          unitPrice: 150000,
          quantity: 1,
          category: 'electronics',
          totalPrice: 150000,
        },
        { unitPrice: 50000, quantity: 3, category: 'toy', totalPrice: 150000 },
        {
          unitPrice: 100000,
          quantity: 1,
          category: 'fashion',
          totalPrice: 100000,
        },
        {
          unitPrice: 70000,
          quantity: 2,
          category: 'books',
          totalPrice: 140000,
        },
        {
          unitPrice: 80000,
          quantity: 1,
          category: 'mens-fashion',
          totalPrice: 80000,
        },
      ],
      paymentMethod: 'paypal',
    };
  }
  calculateLoyaltyPoints() {
    const orders = this.getOrders();
    const order = new OrderVisitor(orders);
    const cashBackCalculator = new CashBackCalculator();
    return order.getTotalCashBack(cashBackCalculator);
  }
}
