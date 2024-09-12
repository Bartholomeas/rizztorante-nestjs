import { ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";

import { RestaurantConfig } from "./entities/restaurant-config.entity";

@Injectable()
export class RestaurantConfigService {
  constructor(
    @InjectRepository(RestaurantConfig)
    private readonly restaurantConfigRepository: Repository<RestaurantConfig>,
  ) {}

  async getRestaurantConfig() {
    return await this.restaurantConfigRepository.find({
      cache: {
        id: "restaurant-config",
        milliseconds: 1000 * 60 * 60 * 6,
      },
      relations: {
        operatingHours: true,
        specialDates: true,
      },
    });
  }

  async initRestaurantConfig() {
    const config = (await this.restaurantConfigRepository.find())?.length > 0;
    if (config) throw new ConflictException("Restaurant config already exists!");

    const newConfig = this.restaurantConfigRepository.create();
    return this.restaurantConfigRepository.save(newConfig);
  }
}
