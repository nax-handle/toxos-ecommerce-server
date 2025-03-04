import { CreateProductDto } from '../dto/create-product.dto';
import { Product } from '../interfaces/product.interface';

export abstract class Category {
  abstract createProduct(
    type: string,
    createProductDto: CreateProductDto,
  ): Product;
}
