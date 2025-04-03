import { Observable } from 'rxjs';
import { Product } from 'src/modules/report/interface/product.interface';

export interface CheckStockAndPriceDto {
  productId: string;
  variantId: string;
  quantity: number;
  price: number;
}

export interface CheckStockAndPriceResponse {
  inStock: boolean;
  price: boolean;
  outOfStock: CheckStockAndPriceDto[];
  priceFluctuations: CheckStockAndPriceDto[];
}

export interface ProductResponse {
  _id: string;
  slug: string;
  title: string;
  price: number;
  status: string;
  discount: number;
  variantName: string;
  optionName: string;
  stock: number;
  description: string;
  thumbnail: string;
  soldCount: number;
  brand: string;
  origin: string;
  shopId: string;
  hasVariant: boolean;
  variants: Variant[];
}

export interface Variant {
  _id: string;
  name: string;
  value: string;
  image: string;
  price: number;
  stock: number;
  sku: string;
}

export interface ProductsResponse {
  items: Product[];
}

export interface ProductService {
  FindOne(data: { id: string }): Observable<ProductResponse>;
  FindMany(data: { ids: string[] }): Observable<ProductsResponse>;
  CheckStockAndPrice(data: {
    products: CheckStockAndPriceDto[];
  }): Observable<CheckStockAndPriceResponse>;
  FindByShopId(data: { shopId: string }): Observable<ProductsResponse>;
}
