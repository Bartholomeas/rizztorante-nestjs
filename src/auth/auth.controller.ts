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
  Session,
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { Request } from "express";

import { AuthUtils } from "@/auth/auth.utils";

import { AuthService } from "./auth.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { LocalAuthGuard } from "./guard/local.auth.guard";
import { SessionContent } from "./session/types/session.types";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Register new user" })
  async register(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    try {
      return await this.authService.createUser(createUserDto);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(err?.message);
    }
  }

  @Post("login-guest")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Login as a guest" })
  async loginGuest(@Session() session: SessionContent) {
    try {
      const guestUser = await this.authService.createGuestUser(
        session?.passport?.user?.id,
        session?.id,
      );

      session.passport = { user: guestUser };
      return AuthUtils.removePasswordFromResponse(guestUser);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(err?.message);
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Login user" })
  async login(@Body(ValidationPipe) loginUserDto: LoginUserDto) {
    try {
      return await this.authService.login(loginUserDto);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(err?.message);
    }
  }

  @Delete("logout")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Logout user" })
  async logout(@Req() req: Request) {
    try {
      req?.session?.destroy(() => {
        console.log("Session destroy", req.sessionID);
      });

      return { message: "Logged out successfully" };
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(err?.message);
    }
  }
}
