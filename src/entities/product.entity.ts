import { double, float } from '@elastic/elasticsearch/lib/api/types';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Category from './category.entity';
import ProductInfo from './productInfo.entity';

export enum ProductTypes {
  MEN = 'men',
  WOMEN = 'women',
}

@Entity()
class Product {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column({ unique: true })
  public code: string;

  @Column()
  public name: string;

  @Column()
  public description: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  public price: number;

  @Column({
    type: 'enum',
    enum: ProductTypes,
  })
  public type: string;

  @Column()
  public totalQuantity: number;

  @Column()
  public discount: boolean;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  public discountAmount: number;

  @Column('text', { array: true })
  public sizeRanges: string[];

  @OneToMany(() => ProductInfo, (productInfo) => productInfo.product, {
    cascade: true,
    eager: true,
  })
  public productInfos: ProductInfo[];

  @ManyToMany(() => Category)
  @JoinTable({
    name: 'product_categories', // table name for the junction table of this relation
    joinColumn: {
      name: 'product',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'category',
      referencedColumnName: 'id',
    },
  })
  categories: Category[];
}

export default Product;
