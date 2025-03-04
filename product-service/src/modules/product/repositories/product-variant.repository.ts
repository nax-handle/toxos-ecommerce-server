import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ProductVariant,
  ProductVariantDocument,
} from '../schemas/product-variant.schema';

@Injectable()
export class ProductVariantRepository {
  constructor(
    @InjectModel(ProductVariant.name)
    private model: Model<ProductVariantDocument>,
  ) {}

  async create(data: Partial<ProductVariant>): Promise<ProductVariant> {
    const variant = new this.model(data);
    return variant.save();
  }

  async findByProduct(productId: string): Promise<ProductVariant[]> {
    return this.model.find({ product: productId }).exec();
  }
}
