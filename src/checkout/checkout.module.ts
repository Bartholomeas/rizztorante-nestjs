import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Cart } from "@/cart/entities/cart.entity";
import { Order } from "@/orders/entities/order.entity";
import { User } from "@/users/entities/user.entity";

import { CheckoutController } from "./checkout.controller";
import { CheckoutService } from "./checkout.service";
import { USER_REPOSITORY_DI } from "@/users/repositories/user.repository";
import { TypeormUserRepository } from "@/users/infra/typeom-user.repository";

@Module({
  imports: [TypeOrmModule.forFeature([User, Cart, Order])],
  controllers: [CheckoutController],
  providers: [
    CheckoutService,
    {
      provide: USER_REPOSITORY_DI,
      useClass: TypeormUserRepository,
    },
  ],
})
export class CheckoutModule {}
