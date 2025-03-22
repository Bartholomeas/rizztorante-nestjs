import { IsPublic } from "@common/decorators/is-public.decorator";
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
import { AuthGuard } from "@nestjs/passport";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Request } from "express";

import { AuthService } from "./auth.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Register new user" })
  async register(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return await this.authService.registerUser(createUserDto);
  }

  @IsPublic()
  @UseGuards(AuthGuard("local"))
  @Post("login-guest")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Login as a guest" })
  async loginGuest() {
    return await this.authService.createOrRetrieveGuestUser();
  }

  @IsPublic()
  @UseGuards(AuthGuard("local"))
  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Login user" })
  async login(@Body(ValidationPipe) loginUserDto: LoginUserDto) {
    return await this.authService.login(loginUserDto);
  }

  @IsPublic()
  @Delete("logout")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Logout user" })
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
