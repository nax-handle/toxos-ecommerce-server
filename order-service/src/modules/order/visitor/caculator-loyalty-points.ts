import { LoyaltyPointsVisitor } from './visitor.interface';
import { MensFashion } from './products/mensfashion';
import { Toy } from './products/toy';

export class LoyaltyPointsCalculator implements LoyaltyPointsVisitor {
  visitMensFashion(product: MensFashion): number {
    return product.price * 0.1;
  }

  visitToy(product: Toy): number {
    return product.price * 0.5;
  }
}
