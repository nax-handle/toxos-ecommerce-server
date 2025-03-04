import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
  Category,
  CategoryDocument,
  Subcategory,
  SubcategoryDocument,
} from './schemas/category.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    @InjectModel(Subcategory.name)
    private subCategoryModel: Model<SubcategoryDocument>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    return await this.categoryModel.create(createCategoryDto);
  }

  async createSubcategory(
    createSubcategory: CreateSubcategoryDto,
  ): Promise<void> {
    const { category: _id } = createSubcategory;
    const category = await this.findById(_id);
    await this.subCategoryModel.create({ ...createSubcategory, category });
  }

  async findAll(): Promise<Category[]> {
    return this.categoryModel.find().exec();
  }

  async findOne(id: string): Promise<Category | null> {
    return this.categoryModel.findById(id).exec();
  }

  async findById(id: string): Promise<CategoryDocument> {
    const category = await this.categoryModel.findById(new Types.ObjectId(id));
    if (!category) {
      throw new BadRequestException('Category not found');
    }
    return category;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category | null> {
    return this.categoryModel
      .findByIdAndUpdate(id, updateCategoryDto, { new: true })
      .exec();
  }

  async updateSubcategory(
    updateSubcategory: UpdateSubcategoryDto,
  ): Promise<void> {
    const { subcategoryId } = updateSubcategory;
    await this.subCategoryModel.findByIdAndUpdate(
      subcategoryId,
      updateSubcategory,
    );
  }

  async remove(id: string): Promise<Category | null> {
    return this.categoryModel.findByIdAndDelete(id).exec();
  }

  async removeSubcategory(subcategoryId: string): Promise<void> {
    await this.subCategoryModel.findByIdAndDelete(subcategoryId);
  }
  async findSubCategory(subcategoryId: string): Promise<Subcategory> {
    const subcategory = await this.subCategoryModel
      .findById(new Types.ObjectId(subcategoryId))
      .populate('category');
    console.log(subcategory);
    if (!subcategory) {
      throw new BadRequestException('SubCategory not found');
    }
    return subcategory;
  }
}
