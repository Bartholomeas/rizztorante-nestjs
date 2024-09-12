import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { RestaurantConfig } from "./restaurant-config.entity";

@Entity()
export class SpecialDates {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => RestaurantConfig, (config) => config.specialDates)
  config: RestaurantConfig;
}
