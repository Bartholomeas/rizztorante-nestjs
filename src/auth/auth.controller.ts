import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Post,
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { AuthService } from "./auth.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { LocalAuthGuard } from "./guard/local.auth.guard";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Register new user" })
  register(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    try {
      return this.authService.createUser(createUserDto);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(err?.message);
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Login user" })
  login(@Body(ValidationPipe) loginUserDto: LoginUserDto) {
    try {
      return this.authService.login(loginUserDto);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(err?.message);
    }
  }
}
