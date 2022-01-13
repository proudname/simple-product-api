import { Entity } from 'typeorm';
import BaseEntity from '../../../common/base.entity';

@Entity()
class User extends BaseEntity {
  email: string;
  password: string;
}

export default User;
