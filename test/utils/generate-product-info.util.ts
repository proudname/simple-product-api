import * as faker from '@faker-js/faker';
import ProductSchema from '../../src/features/product/interfaces/product-schema';

const generateProductInfo = (): ProductSchema => {
  return {
    name: faker.commerce.productName(),
  };
};
export default generateProductInfo;
