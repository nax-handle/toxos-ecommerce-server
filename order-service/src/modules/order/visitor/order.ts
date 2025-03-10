import { LoyaltyPointsVisitor, Product } from './visitor.interface';
import { MensFashion } from './products/mensfashion';
import { Toy } from './products/toy';

interface OrderData {
  totalPrice: number;
  products: { price: number; category: string }[];
}

export class OrderVisitor {
  products: Product[];
  constructor(orderData: OrderData) {
    this.products = orderData.products.map(({ price, category }) => {
      switch (category) {
        case 'toy':
          return new Toy(price);
        case 'mens-fashion':
          return new MensFashion(price);
        default:
          throw new Error(`Unknown category: ${category}`);
      }
    });
  }
  getTotalLoyaltyPoints(visitor: LoyaltyPointsVisitor): number {
    return this.products.reduce(
      (total, product) => total + product.accept(visitor),
      0,
    );
  }
}
