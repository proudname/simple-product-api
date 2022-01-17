import { Column, Entity } from 'typeorm';
import BaseEntity from '../../../common/base.entity';
import ProductSchema from '../interfaces/product-schema';

@Entity()
class Product extends BaseEntity implements ProductSchema {
  @Column()
  name: string;
}

export default Product;
