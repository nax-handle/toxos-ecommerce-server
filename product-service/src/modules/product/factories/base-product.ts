import { CreateProductDto } from '../dto/create-product.dto';
import { Product } from '../interfaces/product.interface';

export abstract class BaseProduct implements Product {
  public title: string;
  public slug: string;
  public status: string;
  public description: string;
  public image: string;
  public soldCount: number;
  public brand: string;
  public origin: string;
  public shopId: string;
  public categoryId: string;
  public name: string;
  public price: number;
  public attributes: Record<any, string>;
  constructor(params: CreateProductDto) {
    Object.assign(this, params);
  }
  abstract getData(): Product;
}
