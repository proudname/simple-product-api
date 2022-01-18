import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { SuperTest } from 'supertest';
import Product from '../src/features/product/entity/product.entity';
import { UserService } from '../src/features/user/user.service';
import generateUserInfo from './utils/generate-user-Info.util';
import { AuthService } from '../src/features/auth/auth.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../src/features/user/user.module';
import { AuthModule } from '../src/features/auth/auth.module';
import { ProductModule } from '../src/features/product/product.module';
import generateProductInfo from './utils/generate-product-info.util';
import * as faker from '@faker-js/faker';
import ProductSchema from '../src/features/product/interfaces/product-schema';
import { PaginationResult } from '../src/types';
import { createArray } from '../src/common/utils/array.util';

describe('ProductController (e2e)', () => {
  jest.setTimeout(10000);

  let module: TestingModule;
  let userService: UserService;
  let authService: AuthService;
  let agent: SuperTest<request.Test>;
  let jwt: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.test',
          isGlobal: true,
        }),
        TypeOrmModule.forRoot(),
        UserModule,
        AuthModule.register(),
        ProductModule,
      ],
    }).compile();
    module = moduleFixture;
    const app = moduleFixture.createNestApplication();
    userService = moduleFixture.get(UserService);
    authService = moduleFixture.get(AuthService);
    agent = request.agent(app.getHttpServer());

    const userInfo = generateUserInfo();
    const user = await userService.createUser(userInfo);
    const loginData = await authService.login(user);
    jwt = loginData.access_token;
    await app.init();
  });

  afterEach(async () => {
    await Product.delete({});
    await module.close();
  });

  describe('/products (POST)', () => {
    it('should get unauthorized error', function () {
      const productPayload = generateProductInfo();
      return agent.post('/products').send(productPayload).expect(401);
    });
    it('should add a product', async () => {
      const productPayload = generateProductInfo();
      const { body: product } = await agent
        .post('/products')
        .set('Authorization', `Bearer ${jwt}`)
        .send(productPayload)
        .expect(201);
      expect(product.name).toBe(productPayload.name);
    });
  });

  describe('/products/:id (PATCH)', () => {
    it('should get unauthorized error', async () => {
      const productInfo = generateProductInfo();
      const savedProduct = await Product.create(productInfo).save();
      const updatedProductPayload: ProductSchema = {
        ...productInfo,
        name: faker.commerce.productName(),
      };
      return agent
        .patch(`/products/${savedProduct.id}`)
        .send(updatedProductPayload)
        .expect(401);
    });
    it('should update a product', async () => {
      const productInfo = generateProductInfo();
      const savedProduct = await Product.create(productInfo).save();
      const updatedProductPayload: ProductSchema = {
        ...productInfo,
        name: faker.commerce.productName(),
      };
      const { body: product } = await agent
        .patch(`/products/${savedProduct.id}`)
        .send(updatedProductPayload)
        .set('Authorization', `Bearer ${jwt}`)
        .expect(200);
      expect(product.name).toBe(updatedProductPayload.name);
    });
  });

  describe('/products/:id (GET)', () => {
    it('should return a single product', async () => {
      const productInfo = generateProductInfo();
      const savedProduct = await Product.create(productInfo).save();
      const { body: product } = await agent.get(`/products`).expect(200);
      const expected: Partial<PaginationResult<Product>> = {
        count: 1,
        data: [savedProduct],
      };
      expect(product).toEqual(expect.objectContaining(expected));
    });
  });

  describe('/products (GET)', () => {
    it('should return list of products', async () => {
      const productsQty = 5;
      const promises = createArray(productsQty).map(() =>
        Product.create(generateProductInfo()).save(),
      );
      await Promise.all(promises);
      const { body: products } = await agent.get('/products').expect(200);
      expect(products).toHaveProperty('data');
      expect(products.data).toBeInstanceOf(Array);
      expect(products.count).toBe(productsQty);
    });
  });
});
