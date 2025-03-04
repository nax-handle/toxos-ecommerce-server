import { CreateProductDto } from '../dto/create-product.dto';

export interface IProductFactory {
  createProduct(createProductDto: CreateProductDto): CreateProductDto;
}
