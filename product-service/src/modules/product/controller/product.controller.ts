import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from '../product.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { GrpcMethod } from '@nestjs/microservices';
import { ShopGuard } from 'src/common/guards/shop.guard';
import { response, Response } from 'src/utils/response';
import { Product } from '../schemas/product.schema';
import { RequestWithShop } from 'src/interfaces/request';
import { GetProductDto } from '../dto/get-products.dto';
import { PaginatedProductResponse } from '../dto/paginated-product-response.dto';
import { GetProductsOfShopDto } from '../dto/get-products-of-shop.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(ShopGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'product_images', maxCount: 5 },
      // { name: 'variant_images', maxCount: 5 },
    ]),
  )
  async create(
    @Body('body') bodyString: string,
    @UploadedFiles()
    files: {
      product_images?: Express.Multer.File[];
      // variant_images?: Express.Multer.File[];
    },
    @Req() req: RequestWithShop,
  ): Promise<Response<string>> {
    const body = JSON.parse(bodyString) as CreateProductDto;
    await this.productService.createProduct({
      ...body,
      files: files,
      shop: req.shop._id,
    });
    return response('success', 'Product created successfully');
  }
  @Get('shop')
  async getProductsOfShop(
    @Query() query: GetProductsOfShopDto,
  ): Promise<Response<PaginatedProductResponse>> {
    const { page = 1, size = 10 } = query;
    const data = await this.productService.getProductsOfShop({
      ...query,
      page: page,
      size: size,
    });
    return response(data, 'success');
  }
  @Get('details/:slug')
  async getBySlug(
    @Param() params: { slug: string },
  ): Promise<Response<Product>> {
    const { slug } = params;
    const data = await this.productService.getBySlug(slug);
    return response(data, 'success');
  }

  @Get()
  async getPaginateProducts(
    @Param() params: GetProductDto,
  ): Promise<Response<PaginatedProductResponse>> {
    console.log(params);
    const { page = 1, size = 10 } = params;
    const data = await this.productService.getPaginateProducts({
      page: page,
      size: size,
    });
    return response(data, 'success');
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
