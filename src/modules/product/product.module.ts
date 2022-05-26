import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import ProductCode from 'src/entities/codeProduct.entity';
import Product from 'src/entities/product.entity';
import { SearchModule } from '../search/search.module';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductCode]), SearchModule],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
