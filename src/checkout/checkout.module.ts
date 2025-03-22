import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Cart } from "@/cart/entities/cart.entity";
import { TypeormCartRepository } from "@/cart/infra/typeorm-cart.repository";
import { CART_REPOSITORY_DI } from "@/cart/repositories/cart.repository";
import { Order } from "@/orders/entities/order.entity";
import { OrdersModule } from "@/orders/orders.module";
import { PaymentsModule } from "@/payments/payments.module";
import { User } from "@/users/entities/user.entity";
import { TypeormUserRepository } from "@/users/infra/typeom-user.repository";
import { USER_REPOSITORY_DI } from "@/users/repositories/user.repository";

import { CheckoutController } from "./checkout.controller";
import { CheckoutService } from "./checkout.service";

@Module({
  imports: [TypeOrmModule.forFeature([User, Cart, Order]), OrdersModule, PaymentsModule],
  controllers: [CheckoutController],
  providers: [
    CheckoutService,
    {
      provide: USER_REPOSITORY_DI,
      useClass: TypeormUserRepository,
    },
    { provide: CART_REPOSITORY_DI, useClass: TypeormCartRepository },
  ],
})
export class CheckoutModule {}
