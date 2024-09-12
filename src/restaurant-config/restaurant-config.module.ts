import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { OperatingHours } from "./entities/operating-hours.entity";
import { SpecialDate } from "./entities/special-dates.entity";
import { RestaurantConfigController } from "./restaurant-config.controller";
import { RestaurantConfigService } from "./restaurant-config.service";

@Module({
  imports: [TypeOrmModule.forFeature([OperatingHours, SpecialDate])],
  controllers: [RestaurantConfigController],
  providers: [RestaurantConfigService],
})
export class RestaurantConfigModule {}
