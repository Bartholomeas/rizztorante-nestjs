import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersModule } from './orders/orders.module';
import { MenuModule } from './menu/menu.module';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [OrdersModule, MenuModule, CartModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
