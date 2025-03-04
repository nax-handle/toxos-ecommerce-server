import { CreateProductDto } from '../../dto/create-product.dto';
import { Product } from '../../interfaces/product.interface';
import { BaseProduct } from '../base-product';

export class Collection extends BaseProduct {
  public material: string;

  constructor(params: CreateProductDto) {
    super(params);
    Object.assign(this, params.attributes);
  }

  getData(): Product {
    return {
      ...this,
      attributes: {
        style: this.material,
      },
    };
  }
}
