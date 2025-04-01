import { ReportVisitor } from './report-visitor.interface';
import { Visitor } from './visitor';

export class Products implements Visitor {
  constructor(public products: Product[]) {}
  accept(v: ReportVisitor) {
    v.visitProduct(this.products);
  }
}
export class Product {
  _id: string;
  title: string;
  slug: string;
  status: string;
  price: number;
  discount: number;
  stock: number;
  description: string;
  thumbnail: string;
  images: string;
  soldCount: number;
  brand: string;
  origin: string;
  variantName: string;
  optionName: string;
  shop: string;
  attributes: [{ name: string; value: string }];
  variants: ProductVariant[];
}

export class ProductVariant {
  _id: string;
  name: string;
  value: string;
  price: number;
  stock: number;
  sku: string;
}
