import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
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
import { ShopGuard } from 'src/common/guards/shop.guard';
import { response, Response } from 'src/utils/response';
import { RequestWithShop } from 'src/interfaces/request';
import { PaginatedProductResponse } from '../dto/paginated-product-response.dto';
import { GetProductsOfShopDto } from '../dto/get-products-of-shop.dto';

@Controller('shop/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(ShopGuard)
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
  @Patch(':id')
  async updateProduct() {}
  @Delete(':id')
  @UseGuards(ShopGuard)
  async deleteProduct(@Req() req: RequestWithShop): Promise<Response<string>> {
    await this.productService.deleteProduct({
      shopId: req.shop._id,
      productId: req.params.id,
    });
    return response('success', 'Product created successfully');
  }
  @Get()
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
}
