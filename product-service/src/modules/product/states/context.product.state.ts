import { ProductService } from '../services/product.service';
import { Product } from '../schemas/product.schema';
import { StateProduct } from './product.state';
import { OutOfStockState } from './state/out-of-stock.state';

export class ContextProduct {
  state: StateProduct;
  quantity: number;
  price: number;
  status: string;
  product: Product;
  productService: ProductService;
  constructor(
    state: StateProduct,
    quantity: number,
    price: number,
    status: string,
  ) {
    this.state = price < quantity ? new OutOfStockState() : state;
    this.quantity = quantity;
    this.price = price;
    this.status = status;
  }
  async syncProduct(productId: string) {
    const product = await this.productService.findOne(productId);
    this.state =
      product.price < product.stock ? new OutOfStockState() : this.state;
  }
  changeState(state: StateProduct): void {
    this.state = state;
  }
  addToCart(): void {
    this.state.addToCart();
  }
  buyNow(): void {
    this.state.buyNow();
  }
}
