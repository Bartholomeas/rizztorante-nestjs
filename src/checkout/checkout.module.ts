import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Cart } from "@/cart/entities/cart.entity";
import { Order } from "@/orders/entities/order.entity";
import { User } from "@/users/entities/user.entity";

import { CheckoutController } from "./checkout.controller";
import { CheckoutService } from "./checkout.service";

@Module({
  imports: [TypeOrmModule.forFeature([User, Cart, Order])],
  controllers: [CheckoutController],
  providers: [CheckoutService],
})
export class CheckoutModule {}
