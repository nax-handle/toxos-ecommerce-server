import { Observable } from 'rxjs';

export interface CheckStockAndPriceDto {
  productId: string;
  variantId: string;
  quantity: number;
  price: number;
}
export interface CheckStockAndPriceResponse {
  items: {
    inStock: boolean;
    price: boolean;
    outOfStock: CheckStockAndPriceDto[];
    priceFluctuations: CheckStockAndPriceDto[];
  };
}
export interface ProductService {
  FindOne(data: { id: string }): Observable<any>;
  FindMany(data: { ids: string[] }): Observable<any>;
  checkStockAndPrice(data: {
    products: CheckStockAndPriceDto[];
  }): Observable<CheckStockAndPriceResponse>;
}
