import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
  // ValidationPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { GrpcMethod } from '@nestjs/microservices';
import { arrayObjectIdToString } from 'src/utils/object-id';
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
    @Body('body') bodyString: string,
    @UploadedFiles()
    files: {
      product_images?: Express.Multer.File[];
      variant_images?: Express.Multer.File[];
    },
  ) {
    const body = JSON.parse(bodyString) as CreateProductDto;
    await this.productService.createProduct({ ...body, files: files });
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

  @GrpcMethod('ProductService', 'FindOne')
  findOne(data: { id: string }) {
    console.log(data);
    return this.productService.findOne(data.id);
  }
  @GrpcMethod('ProductService', 'FindMany')
  async findMany(data: { ids: string[] }) {
    console.log(data);
    const items = await this.productService.findMany(data.ids);
    console.log(arrayObjectIdToString(items));
    return { items: arrayObjectIdToString(items) };
  }
}
