import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { EmployeesService } from "./employees.service";

@Controller("employees")
@ApiTags("Employees")
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get()
  async findAll() {
    return this.employeesService.findAll();
  }
}
