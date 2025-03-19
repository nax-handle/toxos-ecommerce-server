import { Injectable } from '@nestjs/common';
import { CheckStockDto } from '../dto/request/check-stock.dto';
import { Product } from '../schemas/product.schema';
import { OutOfStockDto } from '../dto/response/out-of-stock.dto';
import { PriceFluctuation } from '../dto/response/price-influctuation';

@Injectable()
export class InventoryService {
  checkStock(
    products: Product[],
    checkStockList: CheckStockDto[],
  ): Promise<OutOfStockDto> {
    const productMap = new Map(products.map((p) => [p._id.toString(), p]));
    const outOfStock: CheckStockDto[] = [];

    for (const item of checkStockList) {
      const product = productMap.get(item.productId);
      if (!product) continue;

      if (item.variantId) {
        const variant = product.variants.find(
          (v) => v._id.toString() === item.variantId,
        );
        if (!variant || variant.stock < item.quantity) {
          outOfStock.push(item);
        }
      } else {
        if (product.stock < item.quantity) {
          outOfStock.push(item);
        }
      }
    }

    return Promise.resolve({
      inStock: outOfStock.length === 0,
      outOfStock,
    });
  }
  checkPrice(
    products: Product[],
    checkStockList: CheckStockDto[],
  ): Promise<PriceFluctuation> {
    const productMap = new Map(products.map((p) => [p._id.toString(), p]));
    const priceFluctuations: CheckStockDto[] = [];
    const EPSILON = 1e-6;

    for (const item of checkStockList) {
      const product = productMap.get(item.productId);
      if (!product) continue;

      if (item.variantId) {
        const variant = product.variants.find(
          (v) => v._id.toString() === item.variantId,
        );
        if (!variant) continue;

        if (Math.abs(variant.price - item.price) > EPSILON) {
          priceFluctuations.push({ ...item, price: variant.price });
        }
      } else {
        if (Math.abs(product.price - item.price) > EPSILON) {
          priceFluctuations.push({ ...item, price: product.price });
        }
      }
    }

    return Promise.resolve({
      priceCorrect: priceFluctuations.length === 0,
      priceFluctuations,
    });
  }
  reserveStock() {
    //soon TBA
  }
}
