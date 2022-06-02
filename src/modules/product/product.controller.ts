// Core
import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Response } from 'express';

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
    @Res() response: Response,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ) {
    limit = limit > 100 ? 100 : limit;
    const products = await this.productService.getProducts({
      page,
      limit,
      route: '/',
    });

    response.status(200).send(products);
  }

  @Post('/')
  async createProduct(@Body() data: CreateProductDto) {
    return this.productService.createProduct(data);
  }
}
