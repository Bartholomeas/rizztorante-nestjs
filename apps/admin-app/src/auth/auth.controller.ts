import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { AuthService } from "./auth.service";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { LoginEmployeeDto } from "./dto/login-employee.dto";
import { LocalAuthGuard } from "./guards/local.auth.guard";

import type { Request } from "express";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Register new employee" })
  async register(@Body(ValidationPipe) createEmployeeDto: CreateEmployeeDto) {
    try {
      return await this.authService.registerEmployee(createEmployeeDto);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(err?.message);
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Login employee" })
  async login(@Body(ValidationPipe) loginEmployeeDto: LoginEmployeeDto) {
    try {
      return await this.authService.authenticateEmployee(loginEmployeeDto);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(err?.message);
    }
  }

  @Delete("logout")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Logout employee" })
  async logout(@Req() req: Request) {
    try {
      req?.session?.destroy(() => {});
      return { message: "Logged out successfully" };
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(err?.message);
    }
  }
}
