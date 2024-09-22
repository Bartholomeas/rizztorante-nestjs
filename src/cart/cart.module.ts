import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { User } from "@/auth/entities/user.entity";
import { SessionEntity } from "@/auth/sessions/entity/session.entity";
import { CartItem } from "@/cart/entities/cart-item.entity";
import { Cart } from "@/cart/entities/cart.entity";
import { ConfigurableIngredient } from "@/ingredients/ingredients-config/entities/configurable-ingredient.entity";
import { GuestUserMiddleware } from "@/middlewares/guest-user.middleware";

import { CartController } from "./cart.controller";
import { CartService } from "./cart.service";
import { CartItemCustomConfig } from "./entities/cart-item-custom-config.entity";
import { CartItemConfigurableIngredient } from "./entities/cart-item-custom-ingredient.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Cart,
      CartItem,
      SessionEntity,
      User,
      CartItemCustomConfig,
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
