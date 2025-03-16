import { StateProduct } from '../product.state';

export class OutOfStockState implements StateProduct {
  addToCart(): void {
    console.log('Product is out of stock');
  }
  buyNow(): void {
    console.log('Product is out of stock');
  }
}
