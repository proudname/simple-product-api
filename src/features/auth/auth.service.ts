import { Injectable } from '@nestjs/common';
import UserCredentialsDto from '../../common/dto/user-credentials.dto';
import { UserService } from '../user/user.service';
import User from '../user/entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../../types';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
  async validateUser(credentials: UserCredentialsDto): Promise<User | null> {
    const user = await this.userService.getPasswordByEmail(credentials.email);
    if (!user) return null;
    const isPasswordCorrect = await bcrypt.compare(
      credentials.password,
      user.password,
    );
    if (!isPasswordCorrect) return null;
    return user;
  }

  async login(user: User) {
    const payload: JwtPayload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
