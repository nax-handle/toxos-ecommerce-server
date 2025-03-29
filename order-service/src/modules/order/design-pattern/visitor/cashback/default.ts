import { Order } from '../../../entities/order.entity';
import { CashBack, CashBackVisitor } from '../visitor.interface';

export class Default implements CashBack {
  constructor(public order: Order) {}

  accept(visitor: CashBackVisitor): number {
    return visitor.visitDefault(this.order);
  }
}
