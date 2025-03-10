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
  @Post('test')
  async testGetVariant(
    @Body()
    bodyString: {
      productId: string;
      variantId: string;
      optionId: string;
    }[],
  ) {
    console.log(bodyString);
    const data =
      await this.productService.findProductsWithVariantsAndOptions(bodyString);
    return { message: data };
  }
  @Get()
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
    const items = await this.productService.findMany(data.ids);
    return { items: items };
  }
}
