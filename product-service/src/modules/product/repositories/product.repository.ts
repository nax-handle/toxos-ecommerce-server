// repositories/product.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, UpdateWriteOpResult } from 'mongoose';
import { BulkWriteResult } from 'mongodb';
import { Product, ProductDocument } from '../schemas/product.schema';
import { GetProductDto } from '../dto/request/get-products.dto';
import { GetProductsOfShopDto } from '../dto/request/get-products-of-shop.dto';
import { ObjectId } from 'src/utils/object-id';
import { DeleteProductDto } from '../dto/request/delete-product.dtot';
import { CheckStockDto } from '../dto/request/check-stock.dto';

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
  async updateProduct(
    updateProduct: DeleteProductDto,
  ): Promise<UpdateWriteOpResult> {
    return await this.productModel.updateOne({
      _id: ObjectId(updateProduct.productId),
      shop: updateProduct.shopId,
    });
  }
  async updateStockProducts(
    updateStockList: CheckStockDto[],
  ): Promise<BulkWriteResult> {
    const bulkOps = updateStockList.map((item) => {
      if (item.variantId) {
        return {
          updateOne: {
            filter: {
              _id: item.productId,
              'variants._id': item.variantId,
              'variants.stock': { $gte: item.quantity },
            },
            update: { $inc: { 'variants.$.stock': -item.quantity } },
          },
        };
      } else {
        return {
          updateOne: {
            filter: {
              _id: item.productId,
              stock: { $gte: item.quantity },
            },
            update: { $inc: { stock: -item.quantity } },
          },
        };
      }
    });
    return await this.productModel.bulkWrite(bulkOps);
  }
}
