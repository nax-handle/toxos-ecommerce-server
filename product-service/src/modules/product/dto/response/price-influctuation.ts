import { CheckStockDto } from '../request/check-stock.dto';

export interface PriceFluctuation {
  priceCorrect: boolean;
  priceFluctuations: CheckStockDto[];
}
