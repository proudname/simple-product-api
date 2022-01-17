import * as faker from '@faker-js/faker';
import UserSchema from '../../src/features/user/interfaces/user-schema';

const generateUserInfo = (): UserSchema => {
  return {
    email: faker.internet.email(),
    password: 'testpassword',
  };
};
export default generateUserInfo;
