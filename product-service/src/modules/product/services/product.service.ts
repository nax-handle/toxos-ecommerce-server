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
import { DeleteProductDto } from '../dto/request/delete-product.dtot';
import { PRODUCT_STATUS } from 'src/common/constants/product-status';
import { CheckStockDto } from '../dto/request/check-stock.dto';
import { InventoryService } from './inventory.service';
import { PaginatedProductResponse } from '../dto/response/paginated-product-response.dto';
import { CheckStockAndPriceDto } from '../dto/response/check-stock-and-price.dto';
import { UpdateStockDto } from '../dto/request/update-stock.dto';
import { ClientProxy } from '@nestjs/microservices';
@Injectable()
export class ProductService {
  constructor(
    @Inject('RMQ_SERVICE') private readonly client: ClientProxy,
    private readonly categoryService: CategoryService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly productRepository: ProductRepository,
    // private readonly contextProduct: ContextProduct,
    private readonly inventoryService: InventoryService,
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

  // mapVariantWithImages(
  //   variants: ProductVariantDto[],
  //   images: string[],
  // ): Promise<ProductVariantDto[]> {
  //   const newVariants: ProductVariantDto[] = [];
  //   for (let i = 0; i < variants.length; i++) {
  //     newVariants.push({
  //       ...variants[i],
  //       image: images[i],
  //     });
  //   }
  //   return Promise.resolve(newVariants);
  // }
  async getBySlug(slug: string): Promise<Product> {
    const product = await this.productRepository.findProductBySlug(slug);
    if (!product) {
      throw new BadRequestException('Product not found');
    }
    return product;
  }
  async deleteById(_id: string): Promise<void> {
    await this.productModel.findByIdAndDelete(ObjectId(_id));
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
  async getPaginateProducts(
    getProductDto: GetProductDto,
  ): Promise<PaginatedProductResponse> {
    const [products, productCount] = await Promise.all([
      this.productRepository.getProducts(getProductDto),
      this.productModel.countDocuments().exec(),
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
    console.log(updateStockList.orderIds);
    this.client.emit('order.paid', updateStockList.orderIds).subscribe({
      error: (err) => {
        //refund
        console.error('Failed to send message:', err);
      },
    });
    console.log('send');
  }
}
