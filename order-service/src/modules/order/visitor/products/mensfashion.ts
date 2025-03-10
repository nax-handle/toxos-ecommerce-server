import { LoyaltyPointsVisitor, Product } from '../visitor.interface';

export class MensFashion implements Product {
  constructor(public price: number) {}

  accept(visitor: LoyaltyPointsVisitor): number {
    return visitor.visitMensFashion(this);
  }
}
