import { BaseEntity, Entity } from 'typeorm';

@Entity()
class Product extends BaseEntity {
  name: string;
}

export default Product;
