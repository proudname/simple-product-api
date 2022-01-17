import {
  CacheInterceptor,
  CacheTTL,
  Controller,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import Product from './entity/product.entity';
import { ProductService } from './product.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';

@Crud({
  model: {
    type: Product,
  },
  query: {
    alwaysPaginate: true,
  },
  routes: {
    only: ['getManyBase', 'getOneBase', 'createOneBase', 'updateOneBase'],
    getOneBase: {
      decorators: [UseInterceptors(CacheInterceptor), CacheTTL(60)],
    },
    createOneBase: {
      decorators: [
        UseGuards(AuthGuard('jwt')),
        ApiBearerAuth(),
        ApiException(() => UnauthorizedException),
      ],
    },
    updateOneBase: {
      decorators: [
        UseGuards(AuthGuard('jwt')),
        ApiBearerAuth(),
        ApiException(() => UnauthorizedException),
      ],
    },
  },
})
@ApiTags('products')
@Controller('products')
export class ProductController implements CrudController<Product> {
  constructor(public service: ProductService) {}
}
