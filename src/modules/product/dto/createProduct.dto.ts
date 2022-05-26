import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ProductTypes } from 'src/entities/product.entity';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  price: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsEnum(ProductTypes)
  type: string;

  @IsBoolean()
  @IsOptional()
  discount: boolean;

  @IsString()
  @IsOptional()
  discountAmount: string;

  @IsArray()
  @ValidateNested()
  @Type(() => ProductInfoDto)
  productInfos: ProductInfoDto[];

  @IsArray()
  sizeRanges: string[];
}

class ProductInfoDto {
  @IsArray()
  @IsOptional()
  images: string[];

  @IsString()
  color: string;

  @IsString()
  size: string;

  @IsNumber()
  quantity: number;
}
