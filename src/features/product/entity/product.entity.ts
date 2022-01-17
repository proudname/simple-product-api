import { Column, Entity } from 'typeorm';
import BaseEntity from '../../../common/base.entity';
import ProductSchema from '../interfaces/product-schema';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
class Product extends BaseEntity implements ProductSchema {
  @ApiProperty({ description: 'Product name' })
  @Column()
  name: string;
}

export default Product;
