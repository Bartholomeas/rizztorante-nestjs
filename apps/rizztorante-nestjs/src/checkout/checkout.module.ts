import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Cart } from "@app/restaurant/cart/entities/cart.entity";
import { Order } from "@app/restaurant/orders/entities/order.entity";
import { User } from "@app/restaurant/users/entities/user.entity";

import { CheckoutController } from "./checkout.controller";
import { CheckoutService } from "./checkout.service";

@Module({
  imports: [TypeOrmModule.forFeature([User, Cart, Order])],
  controllers: [CheckoutController],
  providers: [CheckoutService],
})
export class CheckoutModule {}
