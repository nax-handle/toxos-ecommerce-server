// repositories/product.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, UpdateWriteOpResult } from 'mongoose';
import { Product, ProductDocument } from '../schemas/product.schema';
import { GetProductDto } from '../dto/get-products.dto';
import { GetProductsOfShopDto } from '../dto/get-products-of-shop.dto';
import { ObjectId } from 'src/utils/object-id';
import { DeleteProductDto } from '../dto/delete-product.dtot';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async createProduct(data: Partial<Product>): Promise<Product> {
    const product = new this.productModel(data);
    return product.save();
  }

  getProducts(getProductDto: GetProductDto): Promise<Product[]> {
    const { page, size, filter = {} } = getProductDto;
    return this.productModel
      .find(filter)
      .skip((page - 1) * size)
      .limit(size)
      .exec();
  }
  getProductsOfShop(
    getProductsOfShop: GetProductsOfShopDto,
  ): Promise<Product[]> {
    const { page, size, shopId } = getProductsOfShop;
    console.log(shopId);
    console.log(getProductsOfShop);
    return this.productModel
      .find({ shop: ObjectId(shopId) })
      .skip((page - 1) * size)
      .limit(size)
      .lean()
      .exec();
  }
  countProductsOfShop(shopId: string): Promise<number> {
    return this.productModel.countDocuments({ shop: ObjectId(shopId) });
  }
  async findProductBySlug(slug: string): Promise<Product | null> {
    return await this.productModel
      .findOne({ slug })
      .populate('category')
      .populate('subcategory')
      .populate({ path: 'shop' })
      .lean()
      .exec();
  }
  async deleteProduct(
    deleteProduct: DeleteProductDto,
    status: string,
  ): Promise<UpdateWriteOpResult> {
    return await this.productModel.updateOne(
      {
        _id: ObjectId(deleteProduct.productId),
        shop: deleteProduct.shopId,
      },
      {
        status: status,
      },
    );
  }
}
