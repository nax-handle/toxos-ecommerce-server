import { CartItem } from '../interfaces/cart.interface';

export interface VoucherVisitor {
  visitCart(cart: CartItem[]): number;
  visitCartItem(item: CartItem): number;
}

export class PercentageVoucherVisitor implements VoucherVisitor {
  constructor(private readonly percentage: number) {}

  visitCart(cart: CartItem[]): number {
    return cart.reduce((total, item) => total + this.visitCartItem(item), 0);
  }

  visitCartItem(item: CartItem): number {
    return (item.price * item.quantity * (100 - this.percentage)) / 100;
  }
}

export class FixedAmountVoucherVisitor implements VoucherVisitor {
  constructor(private readonly amount: number) {}

  visitCart(cart: CartItem[]): number {
    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    return Math.max(0, total - this.amount);
  }

  visitCartItem(item: CartItem): number {
    return item.price * item.quantity;
  }
}

export class BuyXGetYVoucherVisitor implements VoucherVisitor {
  constructor(
    private readonly requiredQuantity: number,
    private readonly discountQuantity: number,
    private readonly discountPercentage: number,
  ) {}

  visitCart(cart: CartItem[]): number {
    return cart.reduce((total, item) => total + this.visitCartItem(item), 0);
  }

  visitCartItem(item: CartItem): number {
    if (item.quantity < this.requiredQuantity) {
      return item.price * item.quantity;
    }

    const fullPriceQuantity =
      Math.floor(item.quantity / this.requiredQuantity) * this.requiredQuantity;
    const discountedQuantity =
      Math.floor(item.quantity / this.requiredQuantity) * this.discountQuantity;
    const remainingQuantity =
      item.quantity - fullPriceQuantity - discountedQuantity;

    return (
      item.price * fullPriceQuantity +
      (item.price * discountedQuantity * (100 - this.discountPercentage)) /
        100 +
      item.price * remainingQuantity
    );
  }
}
