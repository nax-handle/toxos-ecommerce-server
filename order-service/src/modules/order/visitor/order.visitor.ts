import { CashBackVisitor, CashBack } from './visitor.interface';
// import { MensFashion } from './payments/mensfashion';
import { Default } from './cashback/default';
import { Payment } from './cashback/payment';
import { Order } from '../entities/order.entity';
import { Categories } from './cashback/categories';

export class OrderVisitor {
  coins: number;
  visitors: CashBack[] = [];
  constructor(order: Order) {
    this.visitors = [
      new Payment(order),
      new Categories(order),
      new Default(order),
    ];
  }
  getTotalCashBack(visitor: CashBackVisitor): number {
    this.coins = this.visitors.reduce(
      (total, product) => total + product.accept(visitor),
      0,
    );
    return this.coins;
  }
}
