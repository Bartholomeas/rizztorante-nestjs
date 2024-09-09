import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";

import { User } from "@/auth/entities/user.entity";
import { Cart } from "@/cart/entities/cart.entity";
import { Order } from "@/orders/entities/order.entity";

import { CommandHandlers } from "./commands/handlers";
import { OrdersController } from "./orders.controller";
import { OrdersListener } from "./orders.listener";
import { OrdersService } from "./orders.service";

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([User, Cart, Order])],
  controllers: [OrdersController],
  providers: [...CommandHandlers, OrdersService, OrdersListener],
})
export class OrdersModule {}
