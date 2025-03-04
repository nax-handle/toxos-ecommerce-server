import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import {
  FileFieldsInterceptor,
} from '@nestjs/platform-express';
import { Multer } from 'multer';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'product_images', maxCount: 5 },
      { name: 'variant_images', maxCount: 5 },
    ]),
  )
  async create(
    @Body() body: CreateProductDto,
    @UploadedFiles()
    files: {
      avatar?: Multer.File[];
      background?: Multer.File[];
    },
  ) {
    console.log(files);
    // await this.productService.createProduct({ ...body });
    return { message: 'success' };
  }
  @Get(':slug')
  async getBySlug(@Param() params: { slug: string }) {
    const { slug } = params;
    const data = await this.productService.getBySlug(slug);
    return { message: 'success', data };
  }
  @Get(':id')
  async deleteById(@Param() params: { id: string }) {
    const { id } = params;
    const data = await this.productService.deleteById(id);
    return { message: 'success', data };
  }
}
