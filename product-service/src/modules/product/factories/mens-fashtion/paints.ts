import { CreateProductDto } from '../../dto/create-product.dto';
import { Product } from '../../interfaces/product.interface';
import { BaseProduct } from '../base-product';

export class Pants extends BaseProduct {
  public style: string;
  constructor(params: CreateProductDto) {
    super(params);
    Object.assign(this, params.attributes);
  }
  override getAttributes(): Product {
    return {
      ...this,
      attributes: {
        style: this.style,
      },
    };
  }
}
