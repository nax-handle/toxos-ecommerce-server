import { CheckStockDto } from '../request/check-stock.dto';

export class OutOfStockDto {
  inStock: boolean;
  outOfStock: CheckStockDto[];
}
