import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { User } from "@/auth/entities/user.entity";
import { Order } from "@/orders/entities/order.entity";

import { OrdersController } from "./orders.controller";
import { OrdersListener } from "./orders.listener";
import { OrdersService } from "./orders.service";

@Module({
  imports: [TypeOrmModule.forFeature([User, Order])],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersListener],
})
export class OrdersModule {}
