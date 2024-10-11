import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Cart } from "@app/restaurant/cart/entities/cart.entity";
import { Order } from "@app/restaurant/orders/entities/order.entity";
import { User } from "@app/restaurant/users/entities/user.entity";

import { OrdersController } from "./orders.controller";
import { OrdersListener } from "./orders.listener";
import { OrdersService } from "./orders.service";

@Module({
  imports: [TypeOrmModule.forFeature([User, Cart, Order])],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersListener],
})
export class OrdersModule {}
