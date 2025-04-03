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
import { EventPattern, GrpcMethod, Payload } from '@nestjs/microservices';
import { response, Response } from 'src/utils/response';
import { GetProductDto } from './dto/request/get-products.dto';
import { GetProductsOfShopDto } from './dto/request/get-products-of-shop.dto';
import { Request } from '@nestjs/common';
import { CheckStockDto } from './dto/request/check-stock.dto';
import { PaginatedProductResponse } from './dto/response/paginated-product-response.dto';
import { UpdateStockDto } from './dto/request/update-stock.dto';
import { ShopId } from 'src/common/decorator/shop.decorator';
import { SearchProductDto } from './dto/request/search-product.dto';
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
  async getBySlug(@Param() params: { slug: string }): Promise<Response<any>> {
    const { slug } = params;
    return response(await this.productService.getBySlug(slug), 'success');
  }
  @Get()
  async getPaginateProducts(
    @Query() queries: GetProductDto,
  ): Promise<Response<PaginatedProductResponse>> {
    const { page = 1, size = 10 } = queries;
    const data = await this.productService.getPaginateProducts({
      page: page,
      size: size,
    });
    return response(data, 'success');
  }

  @Get('search')
  async searchProducts(
    @Query() queries: SearchProductDto,
  ): Promise<Response<PaginatedProductResponse>> {
    const { page = 1, size = 10, keyword } = queries;
    const data = await this.productService.searchProduct({
      ...queries,
      page: page,
      size: size,
      keyword,
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
    @ShopId() shopId: string,
  ): Promise<Response<string>> {
    const body = JSON.parse(bodyString) as CreateProductDto;
    // const shopId = req.headers['x-shop-id'] as string;
    console.log(shopId);
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
    const shopId = req.headers['x-shop-id'] as string;
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
  @GrpcMethod('ProductService', 'CheckStockAndPrice')
  async checkStockAndPrice(data: { products: CheckStockDto[] }) {
    const items = await this.productService.checkStockAndPrice(data.products);
    return items;
  }
  @GrpcMethod('ProductService', 'FindByShopId')
  async findByShopId(data: { shopId: string }) {
    const items = await this.productService.getProductsShop(data.shopId);
    return { items: items };
  }
  @EventPattern('update_stock')
  async updateStock(@Payload() data: UpdateStockDto) {
    await this.productService.updateStock(data);
  }
  // @MessagePattern('reverse.stock')
  // async reverseStock(@Body() body: CheckStockDto[]) {
  //   const items = await this.productService.updateStock(body);
  //   return { items: items };
  // }
}
