import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Cart } from "@/cart/entities/cart.entity";
import { Order } from "@/orders/entities/order.entity";
import { Restaurant } from "@/restaurants/entities/restaurant.entity";
import { User } from "@/users/entities/user.entity";

import { TypeormOrdersRepository } from "./infra/typeorm-orders.repository";
import { ORDER_QUEUE } from "./orders.constants";
import { OrdersController } from "./orders.controller";
import { OrdersGateway } from "./orders.gateway";
import { OrdersListener } from "./orders.listener";
import { OrdersProcessor } from "./orders.processor";
import { ORDERS_REPOSITORY_DI } from "./repositories/orders.repository";
import { OrdersCreationService } from "./services/orders-creation.service";
import { OrdersProcessingService } from "./services/orders-processing.service";
import { OrdersService } from "./services/orders.service";

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
  providers: [
    OrdersService,
    OrdersProcessingService,
    OrdersCreationService,
    OrdersGateway,
    OrdersListener,
    OrdersProcessor,
    {
      provide: ORDERS_REPOSITORY_DI,
      useClass: TypeormOrdersRepository,
    },
  ],
  exports: [OrdersService, BullModule],
})
export class OrdersModule {}
