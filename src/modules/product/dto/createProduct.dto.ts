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
  @IsOptional()
  description: string;

  @IsString()
  @IsEnum(ProductTypes)
  type: string;

  @IsArray()
  @ValidateNested()
  @Type(() => ProductInfoDto)
  productInfos: ProductInfoDto[];

  @IsArray()
  sizeRanges: string[];

  @IsArray()
  colors: string[];
}

class ProductInfoDto {
  @IsArray()
  @IsOptional()
  images: string[];

  @IsString()
  color: string;

  @IsString()
  size: string;

  @IsString()
  buyPrice: string;

  @IsString()
  sellPrice: string;

  @IsNumber()
  quantity: number;

  @IsBoolean()
  @IsOptional()
  discount: boolean;

  @IsString()
  @IsOptional()
  discountAmount: string;
}
