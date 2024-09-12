import { Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { OperatingHours } from "./operating-hours.entity";
import { SpecialDate } from "./special-dates.entity";

@Entity()
export class RestaurantConfig {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @OneToMany(() => OperatingHours, (operatingHours) => operatingHours.config)
  operatingHours: OperatingHours[];

  @OneToMany(() => SpecialDate, (specialDate) => specialDate.config)
  specialDates: SpecialDate[];
}
