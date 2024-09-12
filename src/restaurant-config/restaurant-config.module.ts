import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { OperatingHours } from "./entities/operating-hours.entity";
import { RestaurantConfig } from "./entities/restaurant-config.entity";
import { SpecialDates } from "./entities/special-dates.entity";
import { RestaurantConfigController } from "./restaurant-config.controller";
import { RestaurantConfigService } from "./restaurant-config.service";

@Module({
  imports: [TypeOrmModule.forFeature([RestaurantConfig, OperatingHours, SpecialDates])],
  controllers: [RestaurantConfigController],
  providers: [RestaurantConfigService],
})
export class RestaurantConfigModule {}
