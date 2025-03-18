import { Product } from '../../schemas/product.schema';

export interface PaginatedProductResponse {
  total: number;
  totalPage: number;
  page: number;
  products: Product[];
}
