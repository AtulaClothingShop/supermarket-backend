// Core
import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';

// Entity
import Product from 'src/entities/product.entity';

// Dto
import { CreateProductDto } from './dto/createProduct.dto';

// Service
import { ProductService } from './product.service';

@Controller('')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('search')
  async searchProducts(@Query() query) {
    const { text } = query;
    return this.productService.searchForProducts(text);
  }

  @Get('/')
  async getProducts(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ): Promise<Pagination<Product>> {
    limit = limit > 100 ? 100 : limit;
    return this.productService.getProducts({
      page,
      limit,
      route: '/',
    });
  }

  @Post('/')
  async createProduct(@Body() data: CreateProductDto) {
    return this.productService.createProduct(data);
  }
}
