import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";

import { User } from "@/auth/entities/user.entity";
import { Cart } from "@/cart/entities/cart.entity";
import { Order } from "@/orders/entities/order.entity";

import { CheckoutController } from "./checkout.controller";
import { CheckoutService } from "./checkout.service";

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([User, Cart, Order])],
  controllers: [CheckoutController],
  providers: [CheckoutService],
})
export class CheckoutModule {}
