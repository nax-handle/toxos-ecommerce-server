import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { CategoryService } from '../category/category.service';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { Model } from 'mongoose';
import { getSlug } from 'src/utils/slugify';
import { ObjectId } from 'src/utils/object-id';
import { randomString } from 'src/utils/random-string';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { GetProductDto } from './dto/get-products.dto';
import { ProductRepository } from './repositories/product.repository';
import { PaginatedProductResponse } from './dto/paginated-product-response.dto';
import { GetProductsOfShopDto } from './dto/get-products-of-shop.dto';
import { DeleteProductDto } from './dto/delete-product.dtot';
import { PRODUCT_STATUS } from 'src/common/constants/product-status';
import { ContextProduct } from './states/context.product.state';

@Injectable()
export class ProductService {
  // private readonly productFactory: Record<string, Category> = {
  //   mens: new MensFashionFactory(),
  //   toy: new ToyFactory(),
  // };
  constructor(
    private readonly categoryService: CategoryService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly productRepository: ProductRepository,
    private readonly contextProduct: ContextProduct,

    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}
  async createProduct(createProductDto: CreateProductDto): Promise<void> {
    const { subcategoryId, title, files } = createProductDto;
    const subcategory =
      await this.categoryService.findSubCategory(subcategoryId);
    // const categoryFactory = this.productFactory[subcategory.category.type];
    // const product = categoryFactory.createProduct(
    //   subcategory.type,
    //   createProductDto,
    // );

    const uploadedProductImages =
      await this.cloudinaryService.uploadMultipleFiles(
        files.product_images || [],
      );
    // const [uploadedProductImages, uploadedVariantImages] = await Promise.all([
    //   this.cloudinaryService.uploadMultipleFiles(files.variant_images || []),
    // ]);
    // let newVariants: ProductVariantDto[] = [];
    // if (variants) {
    //   newVariants = await this.mapVariantWithImages(
    //     variants,
    //     uploadedVariantImages,
    //   );
    // }
    await this.productModel.create({
      ...createProductDto,
      thumbnail: uploadedProductImages[0],
      images: uploadedProductImages,
      category: subcategory.category._id,
      subcategory: subcategory._id,
      slug: getSlug(title) + randomString(4),
      // variants: newVariants,
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
    console.log(product);
    if (!product) throw new BadRequestException('Product not found');
    return product;
  }

  async findMany(_ids: string[]): Promise<Product[]> {
    const objectIds = _ids.map((id) => ObjectId(id));
    const products = await this.productModel
      .find({ _id: { $in: objectIds } })
      .lean()
      .exec();
    if (!products) throw new BadRequestException('Product not found');
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
    this.contextProduct.syncProduct('active');
    this.contextProduct.addToCart();
  }
}
