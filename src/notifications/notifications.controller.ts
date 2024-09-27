import { Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { UserRole } from "@common/types/user-roles.type";

import { NotificationsService } from "./notifications.service";

@Controller("notifications")
@ApiTags("Notifications")
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // POC
  @Post("/notify-service")
  @HttpCode(HttpStatus.OK)
  async notifyService(): Promise<void> {
    return await this.notificationsService.sendPushToRole(UserRole.SERVICE, "Title", "Body object");
  }
}
