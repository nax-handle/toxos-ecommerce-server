import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, UpdateWriteOpResult } from 'mongoose';
import { BulkWriteResult } from 'mongodb';
import { Product, ProductDocument } from '../schemas/product.schema';
import { GetProductDto } from '../dto/request/get-products.dto';
import { GetProductsOfShopDto } from '../dto/request/get-products-of-shop.dto';
import { ObjectId } from 'src/utils/object-id';
import { DeleteProductDto } from '../dto/request/delete-product.dto';
import { UpdateStockDto } from '../dto/request/update-stock.dto';

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
    const { page, size } = getProductDto;
    return this.productModel
      .find()
      .skip((page - 1) * size)
      .limit(size)
      .exec();
  }
  countProducts(getProductDto: GetProductDto): Promise<number> {
    const { page, size } = getProductDto;
    return this.productModel
      .countDocuments()
      .skip((page - 1) * size)
      .limit(size)
      .exec();
  }
  getProductsOfShop(
    getProductsOfShop: GetProductsOfShopDto,
  ): Promise<Product[]> {
    const { page, size, shopId } = getProductsOfShop;
    return this.productModel
      .find({ shop: shopId })
      .skip((page - 1) * size)
      .limit(size)
      .lean()
      .exec();
  }
  countProductsOfShop(shop: string): Promise<number> {
    return this.productModel.countDocuments({ shop: shop });
  }
  async findProductBySlug(slug: string): Promise<Product | null> {
    return await this.productModel
      .findOne({ slug })
      .populate('category')
      .populate('subcategory')
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
    updateStockList: UpdateStockDto,
  ): Promise<BulkWriteResult> {
    console.log(updateStockList);
    const bulkOps = updateStockList.items.map((item) => {
      if (item.variantId === 'undefined') {
        return {
          updateOne: {
            filter: {
              _id: ObjectId(item.productId),
              stock: { $gte: item.quantity },
            },
            update: { $inc: { stock: -item.quantity } },
          },
        };
      } else {
        return {
          updateOne: {
            filter: {
              _id: ObjectId(item.productId),
              variants: {
                $elemMatch: {
                  _id: ObjectId(item.variantId),
                  stock: { $gte: item.quantity },
                },
              },
            },
            update: { $inc: { 'variants.$.stock': -item.quantity } },
          },
        };
      }
    });
    return await this.productModel.bulkWrite(bulkOps);
  }
}
