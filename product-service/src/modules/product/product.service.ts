import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
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

@Injectable()
export class ProductService {
  private readonly productFactory: Record<string, Category> = {
    mens: new MensFashionFactory(),
    toy: new ToyFactory(),
  };
  constructor(
    private categoryService: CategoryService,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}
  async createProduct(createProductDto: CreateProductDto): Promise<void> {
    const { subcategoryId, title } = createProductDto;
    const subcategory =
      await this.categoryService.findSubCategory(subcategoryId);
    const categoryFactory = this.productFactory[subcategory.category.type];
    const product = categoryFactory.createProduct(
      subcategory.type,
      createProductDto,
    );
    await this.productModel.create({
      category: subcategory.category._id,
      subcategory: subcategory._id,
      ...product.getData(),
      slug: getSlug(title) + randomString(4),
    });
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
}
