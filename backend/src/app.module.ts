import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module';
import { UploadModule } from './upload/upload.module';
import { HealthModule } from './health/health.module';
import { Product } from './products/entities/product.entity';
import { Order } from './orders/entities/order.entity';
import { User } from './auth/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [Product, Order, User],
      synchronize: true, // Only for development
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    }),
    ProductsModule,
    OrdersModule,
    AuthModule,
    UploadModule,
    HealthModule,
  ],
})
export class AppModule {}
