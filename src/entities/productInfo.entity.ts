import { float } from '@elastic/elasticsearch/lib/api/types';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import Product from './product.entity';

@Entity()
class ProductInfo {
    @PrimaryGeneratedColumn()
    public id?: number;

    @Column()
    public images: string[]

    @Column()
    public color: string

    @Column()
    public size: string

    @Column()
    public quantity: number

    @OneToMany(() => Product, (product) => product.productInfos)
    public product: Product;
}

export default ProductInfo;