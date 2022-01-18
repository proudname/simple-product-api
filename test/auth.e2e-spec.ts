import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { SuperTest } from 'supertest';
import { UserService } from '../src/features/user/user.service';
import generateUserInfo from './utils/generate-user-Info.util';
import UserCredentialsDto from '../src/common/dto/user-credentials.dto';
import User from '../src/features/user/entity/user.entity';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../src/features/auth/auth.module';
import UserSchema from '../dist/features/user/interfaces/user-schema';

describe('AuthController (e2e)', () => {
  jest.setTimeout(10000);

  let module: TestingModule;
  let userService: UserService;
  let agent: SuperTest<request.Test>;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.test',
          isGlobal: true,
        }),
        TypeOrmModule.forRoot(),
        AuthModule.register(),
      ],
    }).compile();
    const app = module.createNestApplication();
    userService = module.get(UserService);
    agent = request.agent(app.getHttpServer());
    await app.init();
  });

  afterEach(async () => {
    await User.delete({});
    await module.close();
  });

  describe('/auth/login (POST)', () => {
    it('should return jwt', async () => {
      const userInfo = generateUserInfo();
      await userService.createUser(userInfo);
      const userCredentials: UserCredentialsDto = {
        email: userInfo.email,
        password: userInfo.password,
      };
      const response = await agent.post('/auth/login').send(userCredentials);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('access_token');
    });

    it('should return failed response', async () => {
      const userInfo: UserSchema = {
        email: 'user@user.com',
        password: 'userpassword',
      };
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
});
