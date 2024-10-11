import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";

import { Strategy } from "passport-local";

import { Employee } from "@app/admin/employees/entities/employee.entity";

import { AuthService } from "../auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: "email",
    });
  }

  async validate(email: string, password: string): Promise<Omit<Employee, "password">> {
    try {
      const employee = await this.authService.authenticateEmployee({ email, password });
      return employee;
    } catch (error) {
      throw new UnauthorizedException("Invalid credentials");
    }
  }
}
