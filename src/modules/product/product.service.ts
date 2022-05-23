import { Injectable } from "@nestjs/common";
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { InjectRepository } from "@nestjs/typeorm";
import Product from "src/entities/product.entity";
import { In, Repository } from "typeorm";

@Injectable()
export class ProductService {
    index = 'products'
    constructor(
        @InjectRepository(Product)
        private productRepo: Repository<Product>,

        private readonly elasticsearchService: ElasticsearchService
    ) { }


    async indexProduct(product: Product) {
        return this.elasticsearchService.index<ProductSearchBody>({
            index: this.index,
            body: {
                id: product.id,
                code: product.code,
                name: product.name,
                price: product.price
            }
        })
    }

    async search(text: string) {
        const data = await this.elasticsearchService.search<ProductSearchResult>({
            index: this.index,
            body: {
                query: {
                    multi_match: {
                        query: text,
                        fields: ['code', 'name']
                    }
                }
            }
        })
        console.log("data", data)
        const hits = data.hits.hits;
        let results = hits.map((item) => item._source);

        let products = []
        results.forEach((item) => {
            item.hits.hits.forEach(hit => {
                products.push(hit._source)
            })
        })
        return products
    }

    async searchForProducts(text: string) {
        const results = await this.search(text);
        const ids = results.map(result => result.id);
        if (!ids.length) {
            return [];
        }
        return this.productRepo
            .find({
                where: { id: In(ids) }
            });
    }

    async createProduct(data) {
        const { name, description, price, type, sizeRanges, productInfos } = data

        let newProduct = new Product()
        newProduct.name = name
        newProduct.description = description
        newProduct.price = price
        newProduct.type = type
        newProduct.sizeRanges = sizeRanges

        let totalQuantity = 0
        let _productInfos = []
        productInfos.forEach(item => {
            
        })
    }
}