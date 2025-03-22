import { NotificationEventTypes } from "@events/events";
import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";

import { AcceptNotificationDto } from "./dto/accept-notification.dto";
import { UpdateNotificationDto } from "./dto/update-notification.dto";
import { NotificationToken } from "./entities/notification-token.entity";
import { NotificationsService } from "./notifications.service";

interface EnablePushNotificationEvent {
  userId: string;
  acceptNotificationDto: AcceptNotificationDto;
}

interface DisablePushNotificationEvent {
  userId: string;
  updateDto: UpdateNotificationDto;
}

@Injectable()
export class NotificationsListener {
  constructor(private readonly notificationsService: NotificationsService) {}

  @OnEvent(NotificationEventTypes.ENABLE_PUSH_NOTIFICATION)
  async enablePushNotification({
    userId,
    acceptNotificationDto,
  }: EnablePushNotificationEvent): Promise<NotificationToken> {
    return await this.notificationsService.acceptPushNotification(userId, acceptNotificationDto);
  }

  @OnEvent(NotificationEventTypes.DISABLE_PUSH_NOTIFICATION)
  async disablePushNotification({ userId }: DisablePushNotificationEvent): Promise<void> {
    return await this.notificationsService.disablePushNotification(userId);
  }
}
