import { StateProduct } from '../product.state';

export class AvailableState implements StateProduct {
  addToCart(): void {
    console.log('Product is added to cart');
  }
  buyNow(): void {
    console.log('Product is bought now');
  }
}
