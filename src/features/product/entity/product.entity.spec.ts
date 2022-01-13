import ProductEntity from './product.entity';

describe('Product', () => {
  it('should be defined', () => {
    expect(new ProductEntity()).toBeDefined();
  });
});
