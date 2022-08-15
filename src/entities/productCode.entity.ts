import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class ProductCode {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ unique: true })
  public code: string;

  @Column({ default: false })
  public isUsed: boolean;
}

export default ProductCode;
