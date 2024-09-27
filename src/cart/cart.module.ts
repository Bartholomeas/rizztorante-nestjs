import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { SessionEntity } from "@/auth/sessions/entity/session.entity";
import { CartItem } from "@/cart/entities/cart-item.entity";
import { Cart } from "@/cart/entities/cart.entity";
import { ConfigurableIngredient } from "@/ingredients/ingredients-config/entities/configurable-ingredient.entity";
import { GuestUserMiddleware } from "@/middlewares/guest-user.middleware";
import { User } from "@/users/entities/user.entity";

import { CartController } from "./cart.controller";
import { CartService } from "./cart.service";
import { CartItemConfigurableIngredient } from "./entities/cart-item-configurable-ingredient.entity";

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
  providers: [CartService],
})
export class CartModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(GuestUserMiddleware).forRoutes(CartController);
  }
}
