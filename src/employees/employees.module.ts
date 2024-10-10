import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Restaurant } from "@/restaurants/entities/restaurant.entity";

import { Employee } from "./entities/employee.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Employee, Restaurant])],
})
export class EmployeesModule {}
