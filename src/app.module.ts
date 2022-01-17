import { Module } from '@nestjs/common';
import { UserModule } from './features/user/user.module';
import { AuthModule } from './features/auth/auth.module';
import { ProductModule } from './features/product/product.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(),
    UserModule,
    AuthModule,
    ProductModule,
  ],
})
export class AppModule {}
