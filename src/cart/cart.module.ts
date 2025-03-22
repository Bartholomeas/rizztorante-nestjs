import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { SessionEntity } from "@/auth/sessions/entity/session.entity";
import { CartItem } from "@/cart/entities/cart-item.entity";
import { Cart } from "@/cart/entities/cart.entity";
import { ConfigurableIngredient } from "@/ingredients/ingredients-config/entities/configurable-ingredient.entity";
import { GuestUserMiddleware } from "@/middlewares/guest-user.middleware";
import { User } from "@/users/entities/user.entity";
import { TypeormUserRepository } from "@/users/infra/typeom-user.repository";
import { USER_REPOSITORY_DI } from "@/users/repositories/user.repository";

import { CartController } from "./cart.controller";
import { CartService } from "./cart.service";
import { CartItemConfigurableIngredient } from "./entities/cart-item-configurable-ingredient.entity";
import { TypeormCartRepository } from "./infra/typeorm-cart.repository";
import { CART_REPOSITORY_DI } from "./repositories/cart.repository";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Cart,
      CartItem,
      SessionEntity,
      User,
      CartItemConfigurableIngredient,
      ConfigurableIngredient,
    ]),
  ],
  controllers: [CartController],
  providers: [
    CartService,
    { provide: USER_REPOSITORY_DI, useClass: TypeormUserRepository },
    {
      provide: CART_REPOSITORY_DI,
      useClass: TypeormCartRepository,
    },
  ],
})
export class CartModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(GuestUserMiddleware).forRoutes(CartController);
  }
}
