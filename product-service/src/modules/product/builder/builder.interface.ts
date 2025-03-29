import { FilterQuery } from 'mongoose';
import { Product } from '../schemas/product.schema';

export interface FilterBuilder {
  withName(title: string): FilterBuilder;
  withPriceGreaterThan(price: number): FilterBuilder;
  withPriceLessThan(price: number): FilterBuilder;
  withPaginate(size: number, page: number): FilterBuilder;
  withSortByPrice(sort: string): FilterBuilder;
  build(): FilterQuery<Product>;
}
