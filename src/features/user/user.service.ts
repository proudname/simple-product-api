import { Injectable } from '@nestjs/common';
import User from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import UserSchema from './interfaces/user-schema';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  createUser(userInfo: UserSchema) {
    const user = this.userRepository.create(userInfo);
    return user.save();
  }

  getPasswordByEmail = async (email: User['email']) => {
    return this.userRepository.findOne({
      where: {
        email,
      },
      select: ['password'],
    });
  };
}
