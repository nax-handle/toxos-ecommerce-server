import { StateProduct } from '../product.state';

export class InactiveState implements StateProduct {
  addToCart(): void {
    console.log('Product is added to cart');
  }
  buyNow(): void {
    console.log('Product is bought now');
  }
}
