import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './services/product.service';
import { CreateProductDto } from './dto/request/create-product.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { GrpcMethod } from '@nestjs/microservices';
import { response, Response } from 'src/utils/response';
import { Product } from './schemas/product.schema';
import { GetProductDto } from './dto/request/get-products.dto';
import { GetProductsOfShopDto } from './dto/request/get-products-of-shop.dto';
import { Request } from '@nestjs/common';
import { CheckStockDto } from './dto/request/check-stock.dto';
import { PaginatedProductResponse } from './dto/response/paginated-product-response.dto';
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  //Customer
  @Get('shop/:shopId')
  async getProductsOfShop(
    @Query() query: GetProductsOfShopDto,
    @Param() params: { shopId: string },
  ): Promise<Response<PaginatedProductResponse>> {
    const { page = 1, size = 10 } = query;
    const { shopId } = params;
    const data = await this.productService.getProductsOfShop({
      ...query,
      page: page,
      size: size,
      shopId,
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
    const { page = 1, size = 10 } = params;
    const data = await this.productService.getPaginateProducts({
      page: page,
      size: size,
    });
    return response(data, 'success');
  }
  //Shop
  @Post('create')
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
    @Req() req: Request,
  ): Promise<Response<string>> {
    const body = JSON.parse(bodyString) as CreateProductDto;
    const shopId = req.headers['x-user-id'] as string;
    await this.productService.createProduct({
      ...body,
      files: files,
      shop: shopId,
    });
    return response('success', 'Product created successfully');
  }
  @Get('shop')
  async getProducts(
    @Query() query: GetProductsOfShopDto,
    @Req() req: Request,
  ): Promise<Response<PaginatedProductResponse>> {
    const { page = 1, size = 10 } = query;
    const shopId = req.headers['x-user-id'] as string;
    const data = await this.productService.getProductsOfShop({
      ...query,
      page: page,
      size: size,
      shopId,
    });
    return response(data, 'success');
  }
  //gRPC
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
  @Post('test')
  async checkStock(@Body() body: CheckStockDto[]) {
    const items = await this.productService.checkStock(body);
    return { items: items };
  }
}
