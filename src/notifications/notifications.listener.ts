import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";

import { AcceptNotificationDto } from "./dto/accept-notification.dto";
import { NotificationToken } from "./entities/notification-token.entity";
import { NotificationsService } from "./notifications.service";

interface EnablePushNotificationEvent {
  userId: string;
  acceptNotificationDto: AcceptNotificationDto;
}

@Injectable()
export class NotificationsListener {
  constructor(private readonly notificationsService: NotificationsService) {}

  @OnEvent("notification.enable")
  async enablePushNotification({
    userId,
    acceptNotificationDto,
  }: EnablePushNotificationEvent): Promise<NotificationToken> {
    console.log("enablePushNotification", userId, acceptNotificationDto);
    return await this.notificationsService.acceptPushNotification(userId, acceptNotificationDto);
  }
}
