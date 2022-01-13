import { Injectable } from '@nestjs/common';
import UserCredentialsDto from '../../common/dto/user-credentials.dto';
import { UserService } from '../user/user.service';
import User from '../user/entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../types';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
  async validateUser(credentials: UserCredentialsDto): Promise<User | null> {
    return this.userService.findByCredentials(credentials);
  }

  async login(user: User) {
    const payload: JwtPayload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
