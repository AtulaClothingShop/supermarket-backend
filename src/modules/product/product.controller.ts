import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('search')
  async searchProducts(@Query() query) {
    const { text } = query;
    return this.productService.searchForProducts(text);
  }

  @Post('/')
  async createProduct(@Body() data) {
    return this.productService.createProduct(data);
  }
}
