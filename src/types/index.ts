import Entity from '../common/interfaces/entity';
import User from '../features/user/entity/user.entity';
import { Request } from '@nestjs/common';

export type JwtPayload = {
  sub: Entity['id'];
  email: User['email'];
};

export type AppRequest = Request & { user?: User };

export type PaginationResult<T> = {
  count: 1;
  data: T[];
  page: 1;
  pageCount: 1;
  total: 1;
};

export type JwtResultObject = {
  access_token: string;
};
