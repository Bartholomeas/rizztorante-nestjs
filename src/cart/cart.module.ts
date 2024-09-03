import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { User } from "@/auth/entity/user.entity";
import { SessionEntity } from "@/auth/session/entity/session.entity";

import { CartController } from "./cart.controller";
import { CartService } from "./cart.service";
import { CartItem } from "./entity/cart-item.entity";
import { Cart } from "./entity/cart.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartItem, SessionEntity, User])],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
