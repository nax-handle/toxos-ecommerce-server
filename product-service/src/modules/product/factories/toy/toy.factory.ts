import { CreateProductDto } from '../../dto/create-product.dto';
import { Product } from '../../interfaces/product.interface';
import { Category } from '../category';
import { Collection } from './collection';

export class ToyFactory extends Category {
  createProduct(type: string, createProductDto: CreateProductDto): Product {
    if (type === 'Collection') {
      return new Collection(createProductDto);
    }
    throw new Error('Unknown ToyProduct type');
  }
}
