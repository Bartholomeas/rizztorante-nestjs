import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Cart } from "@/cart/entities/cart.entity";
import { Order } from "@/orders/entities/order.entity";
import { Restaurant } from "@/restaurants/entities/restaurant.entity";
import { User } from "@/users/entities/user.entity";

import { OrdersController } from "./orders.controller";
import { OrdersListener } from "./orders.listener";
import { OrdersService } from "./orders.service";

@Module({
  imports: [TypeOrmModule.forFeature([User, Cart, Order, Restaurant])],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersListener],
})
export class OrdersModule {}
