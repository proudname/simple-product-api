import Entity from '../../common/interfaces/entity.interface';
import User from '../user/entity/user.entity';
import { Request } from '@nestjs/common';

export type JwtPayload = {
  sub: Entity['id'];
  email: User['email'];
};

export type AppRequest = Request & { user?: User };
