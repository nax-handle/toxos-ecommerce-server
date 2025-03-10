import { MensFashion } from './products/mensfashion';
import { Toy } from './products/toy';

export interface Product {
  accept(visitor: LoyaltyPointsVisitor): number;
}

export interface LoyaltyPointsVisitor {
  visitMensFashion(product: MensFashion): number;
  visitToy(product: Toy): number;
}
