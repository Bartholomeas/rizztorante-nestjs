import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Restaurant } from "@/restaurants/entities/restaurant.entity";

import { EmployeesController } from "./employees.controller";
import { EmployeesService } from "./employees.service";
import { Employee } from "./entities/employee.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Employee, Restaurant])],
  providers: [EmployeesService],
  controllers: [EmployeesController],
})
export class EmployeesModule {}
