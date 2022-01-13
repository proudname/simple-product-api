import { CacheModule, Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';

@Module({
  imports: [CacheModule.register()],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
