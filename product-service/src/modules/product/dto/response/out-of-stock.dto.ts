import { CheckStockDto } from '../request/check-stock.dto';

export class OutOfStockDto {
  success: boolean;
  outOfStock: CheckStockDto[];
}
