import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Post('subcategory/:id')
  createSubcategory(
    @Param('id') id: string,
    @Body() createSub: CreateSubcategoryDto,
  ) {
    return this.categoryService.createSubcategory({
      ...createSub,
      category: id,
    });
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Patch('subcategory/:id')
  updateSubcategory(
    @Param('id') id: string,
    @Body() updateSub: UpdateSubcategoryDto,
  ) {
    return this.categoryService.updateSubcategory(updateSub);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }

  @Delete('subcategory/:id')
  removeSubcategory(
    @Param('id') id: string,
    @Body() { subcategoryId }: { subcategoryId: string },
  ) {
    return this.categoryService.removeSubcategory(subcategoryId);
  }
}
