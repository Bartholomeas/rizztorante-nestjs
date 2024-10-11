import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import * as bcrypt from "bcrypt";
import { RemovePasswordUtils } from "libs/shared/utils/remove-password.utils";
import { Repository } from "typeorm";

import { Employee } from "@app/admin/employees/entities/employee.entity";

import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { LoginEmployeeDto } from "./dto/login-employee.dto";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
  ) {}

  async registerEmployee(
    createEmployeeDto: CreateEmployeeDto,
  ): Promise<Omit<Employee, "password">> {
    if (createEmployeeDto.password !== createEmployeeDto.confirmPassword)
      throw new BadRequestException("Passwords do not match");

    const existingEmployee = await this.findEmployeeByEmail(createEmployeeDto.email);

    if (existingEmployee) throw new ConflictException("Employee with this email already exists");

    const hashedPassword = await this.hashPassword(createEmployeeDto.password);
    const newEmployee = this.employeeRepository.create({
      ...createEmployeeDto,
      password: hashedPassword,
    });

    const savedEmployee = await this.employeeRepository.save(newEmployee);
    return RemovePasswordUtils.removePasswordFromResponse(savedEmployee);
  }

  async authenticateEmployee(
    loginEmployeeDto: LoginEmployeeDto,
  ): Promise<Omit<Employee, "password">> {
    const employee = await this.findEmployeeByEmail(loginEmployeeDto.email);

    if (!employee) {
      throw new NotFoundException("Employee not found");
    }

    await this.verifyPassword(loginEmployeeDto.password, employee.password);

    return RemovePasswordUtils.removePasswordFromResponse(employee);
  }

  private async findEmployeeByEmail(email: string): Promise<Employee | undefined> {
    return this.employeeRepository.findOne({ where: { email } });
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  private async verifyPassword(plainTextPassword: string, hashedPassword: string): Promise<void> {
    const isPasswordValid = await bcrypt.compare(plainTextPassword, hashedPassword);
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }
  }
}
