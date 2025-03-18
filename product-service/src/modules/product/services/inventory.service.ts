import { Injectable } from '@nestjs/common';
import { CheckStockDto } from '../dto/request/check-stock.dto';
import { Product } from '../schemas/product.schema';
import { OutOfStockDto } from '../dto/response/out-of-stock.dto';

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
      if (!product) {
        continue;
      }
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
      success: outOfStock.length === 0,
      outOfStock,
    });
  }

  reserveStock() {
    //soon
  }
}
