import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Menu } from "@app/restaurant/menu/entities/menu.entity";

import { Employee } from "@app/admin/employees/entities/employee.entity";

import { Restaurant } from "./entities/restaurant.entity";
import { RestaurantsController } from "./restaurants.controller";
import { RestaurantsService } from "./restaurants.service";

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant, Employee, Menu])],
  controllers: [RestaurantsController],
  providers: [RestaurantsService],
  exports: [RestaurantsService],
})
export class RestaurantsModule {}
