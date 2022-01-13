import { Module } from '@nestjs/common';
import { UserService } from './features/user/user.service';
import { UserModule } from './features/user/user.module';
import { AuthModule } from './features/auth/auth.module';
import { ProductModule } from './features/product/product.module';

@Module({
  imports: [UserModule, AuthModule, ProductModule],
  providers: [UserService],
})
export class AppModule {}
