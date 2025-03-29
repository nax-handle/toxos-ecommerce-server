import { Order } from '../../../entities/order.entity';
import { CashBackVisitor, CashBack } from '../visitor.interface';

export class Payment implements CashBack {
  constructor(public order: Order) {}
  accept(visitor: CashBackVisitor): number {
    return visitor.visitPayment(this.order);
  }
}
