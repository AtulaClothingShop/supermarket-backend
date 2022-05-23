import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { InjectRepository } from '@nestjs/typeorm';
import Product from 'src/entities/product.entity';
import ProductInfo from 'src/entities/productInfo.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class ProductService {
  index = 'products';
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,

    private readonly elasticsearchService: ElasticsearchService,
  ) {}

  async indexProduct(product: Product) {
    return this.elasticsearchService.index<ProductSearchBody>({
      index: this.index,
      body: {
        id: product.id,
        code: product.code,
        name: product.name,
        price: product.price,
      },
    });
  }

  async search(text: string) {
    const data = await this.elasticsearchService.search<ProductSearchResult>({
      index: this.index,
      body: {
        query: {
          multi_match: {
            query: text,
            fields: ['code', 'name'],
          },
        },
      },
    });
    console.log('data', data);
    const hits = data.hits.hits;
    const results = hits.map((item) => item._source);

    const products = [];
    results.forEach((item) => {
      item.hits.hits.forEach((hit) => {
        products.push(hit._source);
      });
    });
    return products;
  }

  async searchForProducts(text: string) {
    const results = await this.search(text);
    const ids = results.map((result) => result.id);
    if (!ids.length) {
      return [];
    }
    return this.productRepo.find({
      where: { id: In(ids) },
    });
  }

  async createProduct(data) {
    const {
      code,
      name,
      description,
      price,
      type,
      discount,
      discountAmount,
      productInfos,
      sizeRanges = [],
    } = data;
    console.log(data);
    const newProduct = new Product();
    newProduct.code = code;
    newProduct.name = name ?? '';
    newProduct.description = description ?? '';
    newProduct.price = price ?? 0;
    newProduct.type = type ?? '';
    newProduct.discount = Boolean(discount);
    newProduct.discountAmount = discountAmount ? Number(discountAmount) : 0;
    newProduct.sizeRanges = sizeRanges;

    let totalQuantity = 0;
    const _productInfos = [];
    if (productInfos && productInfos.length > 0) {
      productInfos.forEach((item) => {
        const productInfo = new ProductInfo();
        productInfo.color = item.color ?? '';
        productInfo.size = item.size ?? '';
        productInfo.quantity = item.quantity ? Number(item.quantity) : 0;

        if (item.images?.length > 0) {
          productInfo.images = item.images;
        } else {
          productInfo.images = [];
        }

        totalQuantity += item.quantity ? Number(item.quantity) : 0;
        _productInfos.push(productInfo);
      });
    }

    newProduct.totalQuantity = totalQuantity;
    newProduct.productInfos = _productInfos;
    newProduct.categories = [];
    console.log(newProduct, _productInfos);
    await this.productRepo.save(newProduct);

    return newProduct;
  }
}
