import { BadRequestException, Injectable, Inject } from '@nestjs/common';
import { CreateProductDto } from '../dto/request/create-product.dto';
import { CategoryService } from '../../category/category.service';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from '../schemas/product.schema';
import { Model } from 'mongoose';
import { getSlug } from 'src/utils/slugify';
import { ObjectId } from 'src/utils/object-id';
import { randomString } from 'src/utils/random-string';
import { CloudinaryService } from '../../cloudinary/cloudinary.service';
import { GetProductDto } from '../dto/request/get-products.dto';
import { ProductRepository } from '../repositories/product.repository';
import { GetProductsOfShopDto } from '../dto/request/get-products-of-shop.dto';
import { DeleteProductDto } from '../dto/request/delete-product.dto';
import { PRODUCT_STATUS } from 'src/common/constants/product-status';
import { CheckStockDto } from '../dto/request/check-stock.dto';
import { InventoryService } from './inventory.service';
import { PaginatedProductResponse } from '../dto/response/paginated-product-response.dto';
import { CheckStockAndPriceDto } from '../dto/response/check-stock-and-price.dto';
import { UpdateStockDto } from '../dto/request/update-stock.dto';
import { ClientProxy } from '@nestjs/microservices';
import { CacheProxy } from 'src/common/cache/cache';
import { SearchProductDto } from '../dto/request/search-product.dto';
import { ProductFilterBuilder } from '../builder/product-filter.builder';
@Injectable()
export class ProductService {
  constructor(
    @Inject('RMQ_ORDER') private readonly client: ClientProxy,
    private readonly categoryService: CategoryService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly productRepository: ProductRepository,
    private readonly inventoryService: InventoryService,
    private readonly cacheProxy: CacheProxy,
    private readonly productFilterBuilder: ProductFilterBuilder,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async createProduct(createProductDto: CreateProductDto): Promise<void> {
    const { subcategoryId, title, files } = createProductDto;
    const subcategory =
      await this.categoryService.findSubCategory(subcategoryId);
    const uploadedProductImages =
      await this.cloudinaryService.uploadMultipleFiles(
        files.product_images || [],
      );
    await this.productModel.create({
      ...createProductDto,
      thumbnail: uploadedProductImages[0],
      images: uploadedProductImages,
      category: subcategory.category._id,
      subcategory: subcategory._id,
      slug: getSlug(title) + randomString(4),
    });
  }
  async searchProduct(
    searchProduct: SearchProductDto,
  ): Promise<PaginatedProductResponse> {
    const { page, size, minPrice, maxPrice, rating, keyword, sortByPrice } =
      searchProduct;
    this.productFilterBuilder
      .withName(keyword)
      .withPriceGreaterThan(Number(minPrice))
      .withPriceLessThan(Number(maxPrice))
      .withRatingGreaterThan(Number(rating));
    const countPipeline = [
      ...this.productFilterBuilder.build(),
      { $count: 'total' },
    ];
    this.productFilterBuilder.withPaginate(page, size);
    this.productFilterBuilder.withSortByPrice(sortByPrice);
    const pipeline = this.productFilterBuilder.build();
    const [total, data] = await Promise.all([
      this.productModel.aggregate(countPipeline).exec() as Promise<
        { total: number }[]
      >,
      this.productModel.aggregate(pipeline).exec(),
    ]);
    this.productFilterBuilder.reset();
    return {
      total: total[0]?.total,
      totalPage: Math.ceil(total[0]?.total / size),
      page,
      products: data as Product[],
    };
  }
  async deleteById(_id: string): Promise<void> {
    await this.productModel.findByIdAndDelete(ObjectId(_id));
  }
  async getBySlug(slug: string): Promise<Product> {
    const product = await this.cacheProxy.getOrSet<Product>(
      `product:${slug}`,
      async () => {
        const result = await this.productRepository.findProductBySlug(slug);
        if (!result) throw new Error('Product not found');
        return result;
      },
      10,
    );
    return product;
  }

  async getPaginateProducts(
    getProductDto: GetProductDto,
  ): Promise<PaginatedProductResponse> {
    const [products, productCount] = await Promise.all([
      this.productRepository.getProducts(getProductDto),
      this.productRepository.countProducts(getProductDto),
    ]);
    return {
      total: productCount,
      totalPage: Math.ceil(productCount / getProductDto.size),
      page: getProductDto.page,
      products,
    };
  }
  async getProductsOfShop(
    getProductDto: GetProductsOfShopDto,
  ): Promise<PaginatedProductResponse> {
    const [products, productCount] = await Promise.all([
      this.productRepository.getProductsOfShop(getProductDto),
      this.productRepository.countProductsOfShop(getProductDto.shopId),
    ]);
    return {
      total: productCount,
      totalPage: Math.ceil(productCount / getProductDto.size),
      page: getProductDto.page,
      products,
    };
  }
  async deleteProduct(deleteProduct: DeleteProductDto): Promise<void> {
    const updatedProduct = await this.productRepository.deleteProduct(
      deleteProduct,
      PRODUCT_STATUS.INACTIVE,
    );
    if (updatedProduct.modifiedCount === 0) {
      throw new BadRequestException('Product not found');
    }
  }
  async updateProduct(): Promise<void> {}
  addToCart() {
    // this.contextProduct.syncProduct('active');
    // this.contextProduct.addToCart();
  }
  async checkStockAndPrice(
    checkStockList: CheckStockDto[],
  ): Promise<CheckStockAndPriceDto> {
    const productIds = checkStockList.map((item) => item.productId);
    const products = await this.findMany(productIds);
    const [stockResult, priceResult] = await Promise.all([
      this.inventoryService.checkStock(products, checkStockList),
      this.inventoryService.checkPrice(products, checkStockList),
    ]);
    return {
      inStock: stockResult.inStock,
      price: priceResult.priceCorrect,
      outOfStock: stockResult.outOfStock,
      priceFluctuations: priceResult.priceFluctuations,
    };
  }
  async updateStock(updateStockList: UpdateStockDto): Promise<void> {
    const result =
      await this.productRepository.updateStockProducts(updateStockList);
    if (result.modifiedCount !== updateStockList.items.length) {
      // this.client.emit('order.failed', {
      //   success: false,
      //   orderIds: updateStockList.orderIds,
      // });
    }
    this.client.emit('order.paid', updateStockList.orderIds).subscribe({
      error: (err) => {
        //refund
        console.error('Failed to send message:', err);
      },
    });
  }
  async getProductOfShop(_id: string): Promise<Product> {
    const product = await this.productModel.findOne({ shop: _id });
    if (!product) throw new BadRequestException('Product not found');
    return product;
  }
  async findOne(_id: string): Promise<Product> {
    const product = await this.productModel.findById(ObjectId(_id));
    if (!product) throw new BadRequestException('Product not found');
    return product;
  }

  async findMany(_ids: string[]): Promise<Product[]> {
    const objectIds = _ids.map((id) => ObjectId(id));
    const products = await this.productModel
      .find({ _id: { $in: objectIds } })
      .lean()
      .exec();
    return products;
  }
  async getProductsShop(shop: string): Promise<Product[]> {
    return await this.productModel.find({ shop: shop });
  }
}
