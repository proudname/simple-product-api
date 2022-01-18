import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { SuperTest } from 'supertest';
import Product from '../src/features/product/entity/product.entity';
import { UserService } from '../src/features/user/user.service';
import generateUserInfo from './utils/generate-user-Info.util';
import UserCredentialsDto from '../src/common/dto/user-credentials.dto';
import { getRepository, Repository } from 'typeorm';
import User from '../src/features/user/entity/user.entity';
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
import Entity from '../src/common/interfaces/entity';
import { createArray } from '../src/common/utils/array.util';

describe('AppController (e2e)', () => {
  jest.setTimeout(60000);

  let module: TestingModule;
  let userService: UserService;
  let authService: AuthService;
  let userRepository: Repository<User>;
  let productRepository: Repository<Product>;
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
        AuthModule,
        ProductModule,
      ],
    }).compile();
    module = moduleFixture;
    const app = moduleFixture.createNestApplication();
    userService = moduleFixture.get(UserService);
    authService = moduleFixture.get(AuthService);
    userRepository = await getRepository(User);
    productRepository = await getRepository(Product);
    agent = request.agent(app.getHttpServer());

    const userInfo = generateUserInfo();
    const user = await userService.createUser(userInfo);
    const tokenResponse = await authService.login(user);
    jwt = tokenResponse.access_token;
    await app.init();
  });

  afterEach(async () => {
    if (productRepository) await productRepository.delete({});
    if (productRepository) await userRepository.delete({});
    await module.close();
  });

  describe('/auth/login (POST)', () => {
    it('should return jwt', async () => {
      const userInfo = generateUserInfo();
      await userService.createUser(userInfo);
      const userCredentials: any = {
        username: userInfo.email,
        password: userInfo.password,
      };
      const response = await agent.post('/auth/login').send(userCredentials);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('access_token');
    });

    it('should receive failed response', async () => {
      const userInfo = generateUserInfo();
      await userService.createUser(userInfo);
      const userCredentials: UserCredentialsDto = {
        email: userInfo.email,
        password: 'incorrectpassword',
      };
      const response = await agent.post('/auth/login').send(userCredentials);

      expect(response.status).toBe(401);
      expect(response.body).not.toHaveProperty('access_token');
    });
  });

  describe('/products (POST)', () => {
    it('should get unauthorized error', function () {
      const productPayload = generateProductInfo();
      return agent.post('/products').send(productPayload).expect(401);
    });
    it('should add a product', function () {
      const productPayload = generateProductInfo();
      return agent
        .post('/products')
        .set('Authorization', `Bearer ${jwt}`)
        .send(productPayload)
        .expect(201)
        .expect((res) => {
          const product = res.body as Product;
          expect(product.name).toBe(productPayload.name);
        });
    });
  });

  describe('/products/:id (PATCH)', () => {
    it('should get unauthorized error', async () => {
      const productInfo = generateProductInfo();
      const savedProduct = await productRepository.save(productInfo);
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
      const savedProduct = await productRepository.save(productInfo);
      const updatedProductPayload: ProductSchema = {
        ...productInfo,
        name: faker.commerce.productName(),
      };
      return agent
        .patch(`/products/${savedProduct.id}`)
        .send(updatedProductPayload)
        .set('Authorization', `Bearer ${jwt}`)
        .expect(200)
        .expect((res) => {
          const product = res.body as Product;
          expect(product.name).toBe(updatedProductPayload.name);
        });
    });
  });

  describe('/products/:id (GET)', () => {
    it('should return a single product', async () => {
      const productInfo = generateProductInfo();
      const savedProduct = await productRepository.save(productInfo);
      return agent
        .get(`/products`)
        .expect(200)
        .expect((res) => {
          const product = res.body as PaginationResult<Product>;
          const expected: Partial<PaginationResult<Product>> = {
            count: 1,
            data: [savedProduct],
          };
          expect(product).toEqual(expect.objectContaining(expected));
        });
    });
  });

  describe('/products (GET)', () => {
    it('should return list of products', async () => {
      const productsQty = 5;
      const promises = createArray(productsQty).map(() =>
        productRepository.save(generateProductInfo()),
      );
      await Promise.all(promises);
      return agent
        .get('/products')
        .expect(200)
        .expect((res) => {
          const products = res.body as PaginationResult<Product & Entity>;
          expect(products).toHaveProperty('data');
          expect(products.data).toBeInstanceOf(Array);
          expect(products.count).toBe(productsQty);
        });
    });
  });
});
