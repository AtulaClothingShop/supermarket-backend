import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import Product from './product.entity';

@Entity()
class ProductInfo {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column('text', { array: true })
  public images: string[];

  @Column()
  public color: string;

  @Column()
  public size: string;

  @Column()
  public quantity: number;

  @ManyToOne(() => Product, (product) => product.productInfos)
  public product: Product;
}

export default ProductInfo;
