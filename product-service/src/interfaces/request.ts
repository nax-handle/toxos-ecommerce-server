import { Shop } from 'src/modules/shop/schemas/shop.schema';
import { Request } from 'express';
export interface RequestWithShop extends Request {
  shop: Shop;
}
