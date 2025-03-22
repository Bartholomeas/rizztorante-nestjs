import { JwtUser } from "@common/decorators/jwt-user.decorator";
import { JwtUserDto } from "@common/types/jwt.types";
import { Controller, Get, HttpCode, HttpStatus, Put, Session } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { SessionContent } from "@/auth/sessions/types/session.types";

import { UsersService } from "./services/users.service";

@ApiTags("Users")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("me")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get current user" })
  // async getCurrentUser(@Session() session: SessionContent, @JwtUser() user: any) {
  async getCurrentUser(@JwtUser() user: JwtUserDto) {
    console.log("Curr user:: ", user);
    return await this.usersService.getCurrentUser(user.id);
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
