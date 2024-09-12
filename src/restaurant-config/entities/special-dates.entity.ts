import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { RestaurantConfig } from "./restaurant-config.entity";

@Entity()
export class SpecialDate {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ default: false })
  isClosed: boolean;

  @Column({ type: "date" })
  date: Date;

  @Column({ type: "time" })
  openingTime: string;

  @Column({ type: "time" })
  closingTime: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @ManyToOne(() => RestaurantConfig, (config) => config.specialDates)
  config: RestaurantConfig;
}
