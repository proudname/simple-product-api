import { Injectable } from '@nestjs/common';
import User from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import UserCredentialsDto from '../../common/dto/user-credentials.dto';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  findByCredentials = (credentials: UserCredentialsDto) => {
    const { email, password } = credentials;
    const passwordHash = this.hashPassword(password);
    return this.userRepository.findOne({
      where: {
        email,
        password: passwordHash,
      },
    });
  };

  hashPassword = (password: string) => {
    return bcrypt.hash(password, bcrypt.genSaltSync(10));
  };
}
