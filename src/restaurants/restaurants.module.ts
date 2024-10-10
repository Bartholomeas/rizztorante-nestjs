import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Employee } from "@/employees/entities/employee.entity";
import { Menu } from "@/menu/entities/menu.entity";

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
