import { CreateProductDto } from '../../dto/create-product.dto';
import { Product } from '../../interfaces/product.interface';
import { Category } from '../category';
import { Pants } from './paints';
import { TShirt } from './t-shirt';

export class MensFashionFactory extends Category {
  createProduct(type: string, createProductDto: CreateProductDto): Product {
    const mensFashionStrategy: Record<string, Product> = {
      tshirt: new TShirt(createProductDto),
      pants: new Pants({ ...createProductDto }),
    };
    const product = mensFashionStrategy[type.toLowerCase()];
    if (!product) {
      throw new Error(`No product found for type: ${type}`);
    }
    return product;
  }
}
