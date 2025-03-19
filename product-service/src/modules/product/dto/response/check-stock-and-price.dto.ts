import { CheckStockDto } from '../request/check-stock.dto';

export interface CheckStockAndPriceDto {
  inStock: boolean;
  price: boolean;
  outOfStock: CheckStockDto[];
  priceFluctuations: CheckStockDto[];
}
