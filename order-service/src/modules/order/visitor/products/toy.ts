import { LoyaltyPointsVisitor, Product } from '../visitor.interface';

export class Toy implements Product {
  constructor(public price: number) {}

  accept(visitor: LoyaltyPointsVisitor): number {
    return visitor.visitToy(this);
  }
}
