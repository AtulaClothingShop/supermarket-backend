import { Controller, Get, Query } from "@nestjs/common";
import { ProductService } from "./product.service";

@Controller('product')
export class ProductController {
    constructor(
        private readonly productService: ProductService
    ){}

    @Get('search')
    async searchProducts(@Query() query) {
        const { text } = query
        return this.productService.searchForProducts(text)
    }
}