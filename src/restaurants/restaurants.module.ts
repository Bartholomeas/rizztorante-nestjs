import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Menu } from "@/menu/entities/menu.entity";
import { Order } from "@/orders/entities/order.entity";
import { User } from "@/users/entities/user.entity";

import { Restaurant } from "./entities/restaurant.entity";
import { RestaurantsController } from "./restaurants.controller";
import { RestaurantsService } from "./restaurants.service";

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant, Order, User, Menu])],
  providers: [RestaurantsService],
  controllers: [RestaurantsController],
  exports: [RestaurantsService],
})
export class RestaurantsModule {}
