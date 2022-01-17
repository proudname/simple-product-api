import {
  CacheInterceptor,
  CacheTTL,
  Controller,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import Product from './entity/product.entity';
import { ProductService } from './product.service';
import { AuthGuard } from '@nestjs/passport';

@Crud({
  model: {
    type: Product,
  },
  query: {
    alwaysPaginate: true,
  },
  routes: {
    getManyBase: {},
    getOneBase: {
      decorators: [UseInterceptors(CacheInterceptor), CacheTTL(60)],
    },
    createOneBase: {
      decorators: [UseGuards(AuthGuard('jwt'))],
    },
    updateOneBase: {
      decorators: [UseGuards(AuthGuard('jwt'))],
    },
    deleteOneBase: {
      decorators: [UseGuards(AuthGuard('jwt'))],
    },
  },
})
@Controller('products')
export class ProductController implements CrudController<Product> {
  constructor(public service: ProductService) {}
}
