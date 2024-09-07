import { Module } from "@nestjs/common";

import { OrdersController } from "./orders.controller";
import { OrdersListener } from "./orders.listener";
import { OrdersService } from "./orders.service";

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, OrdersListener],
})
export class OrdersModule {}
