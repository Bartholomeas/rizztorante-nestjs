import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BullModule } from "@nestjs/bullmq";

import { Cart } from "@/cart/entities/cart.entity";
import { Order } from "@/orders/entities/order.entity";
import { Restaurant } from "@/restaurants/entities/restaurant.entity";
import { User } from "@/users/entities/user.entity";

import { OrdersController } from "./orders.controller";
import { OrdersListener } from "./orders.listener";
import { ORDER_QUEUE } from "./orders.constants";

import { OrdersService } from "./services/orders.service";
import { CreateOrdersService } from "./services/create-orders.service";
import { OrdersProcessor } from "./orders.processor";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Cart, Order, Restaurant]),
    BullModule.registerQueue({
      name: ORDER_QUEUE,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 1000,
        },
      },
    }),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, CreateOrdersService, OrdersListener, OrdersProcessor],
})
export class OrdersModule {}
