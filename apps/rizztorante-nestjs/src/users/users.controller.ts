import {
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Put,
  Session,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { SessionContent } from "@app/restaurant/auth/sessions/types/session.types";

import { UsersService } from "./users.service";

@ApiTags("Users")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("me")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get current user" })
  async getCurrentUser(@Session() session: SessionContent) {
    try {
      return await this.usersService.getCurrentUser(session?.passport?.user?.id);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(err?.message);
    }
  }

  @Put("/enable-push-notification")
  @HttpCode(HttpStatus.OK)
  async enablePushNotification(@Session() session: SessionContent): Promise<void> {
    return await this.usersService.enablePushNotification(session?.passport?.user?.id);
  }

  @Put("/disable-push-notification")
  @HttpCode(HttpStatus.OK)
  async disablePushNotification(@Session() session: SessionContent): Promise<void> {
    return await this.usersService.disablePushNotification(session?.passport?.user?.id);
  }
}
