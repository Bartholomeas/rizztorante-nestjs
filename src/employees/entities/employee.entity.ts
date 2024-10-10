import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";

import { EmployeeRole } from "@common/types/employee-roles.type";

import { Restaurant } from "@/restaurants/entities/restaurant.entity";

@Entity()
export class Employee {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: "enum", enum: EmployeeRole, default: EmployeeRole.DEFAULT })
  role: EmployeeRole;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.employees)
  restaurant: Restaurant;
}
