import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto, ProductVariantDto } from './dto/create-product.dto';
import { MensFashionFactory } from './factories/mens-fashtion/mens-fashion.factory';
import { Category } from './factories/category';
import { ToyFactory } from './factories/toy/toy.factory';
import { CategoryService } from '../category/category.service';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { Model } from 'mongoose';
import { getSlug } from 'src/utils/slugify';
import { ObjectId } from 'src/utils/object-id';
import { randomString } from 'src/utils/random-string';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class ProductService {
  private readonly productFactory: Record<string, Category> = {
    mens: new MensFashionFactory(),
    toy: new ToyFactory(),
  };
  constructor(
    private readonly categoryService: CategoryService,
    private readonly cloudinaryService: CloudinaryService,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}
  async createProduct(createProductDto: CreateProductDto): Promise<void> {
    const { subcategoryId, title, files, variants } = createProductDto;
    const subcategory =
      await this.categoryService.findSubCategory(subcategoryId);
    const categoryFactory = this.productFactory[subcategory.category.type];
    const product = categoryFactory.createProduct(
      subcategory.type,
      createProductDto,
    );
    const [uploadedProductImages, uploadedVariantImages] = await Promise.all([
      this.cloudinaryService.uploadMultipleFiles(files.product_images || []),
      this.cloudinaryService.uploadMultipleFiles(files.variant_images || []),
    ]);
    const newVariants = await this.mapVariantWithImages(
      variants,
      uploadedVariantImages,
    );
    await this.productModel.create({
      thumbnail: uploadedProductImages[0],
      images: uploadedProductImages,
      category: subcategory.category._id,
      subcategory: subcategory._id,
      ...product.getAttributes(),
      slug: getSlug(title) + randomString(4),
      variants: newVariants,
    });
  }

  mapVariantWithImages(
    variants: ProductVariantDto[],
    images: string[],
  ): Promise<ProductVariantDto[]> {
    const newVariants: ProductVariantDto[] = [];
    for (let i = 0; i < variants.length; i++) {
      newVariants.push({
        ...variants[i],
        image: images[i],
      });
    }
    return Promise.resolve(newVariants);
  }
  async getBySlug(slug: string): Promise<Product> {
    const product = await this.productModel.findOne({ slug });
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
}
