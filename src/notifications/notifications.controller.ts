import { UserRole } from "@common/types/user-roles.type";
import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Post,
  Req,
  Session,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Request } from "express";

import { SessionContent } from "@/auth/sessions/types/session.types";

import { CreateNotificationDto } from "./dto/create-notification.dto";
import { NotificationToken } from "./entities/notification-token.entity";
import { NotificationsService } from "./notifications.service";
import { getDeviceType } from "./notifications.utils";

@Controller("notifications")
@ApiTags("Notifications")
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // POC
  @Post("/notify-service")
  @HttpCode(HttpStatus.OK)
  async notifyService(@Body() createNotificationDto: CreateNotificationDto): Promise<void> {
    try {
      return await this.notificationsService.sendPushToRole(
        UserRole.SERVICE,
        createNotificationDto,
      );
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }

  @Post("/accept-notification")
  @HttpCode(HttpStatus.OK)
  async acceptNotification(
    @Req() req: Request,
    @Session() session: SessionContent,
  ): Promise<NotificationToken> {
    const deviceType = getDeviceType(req.header("user-agent"));

    return await this.notificationsService.acceptPushNotification(session?.passport.user.id, {
      deviceType,
    });
  }
}
