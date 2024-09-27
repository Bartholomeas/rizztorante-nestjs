import { Type } from "class-transformer";
import { IsObject, IsOptional, IsString, IsUUID } from "class-validator";

import type { NotificationEventTypes } from "@events/events";

import { AcceptNotificationDto } from "@/notifications/dto/accept-notification.dto";

export type NotificationsPayloads = {
  [NotificationEventTypes.ENABLE_PUSH_NOTIFICATION]: EnablePushNotificationPayload;
  [NotificationEventTypes.DISABLE_PUSH_NOTIFICATION]: DisablePushNotificationPayload;
};

abstract class DefaultPushNotificationPayload {
  @IsString()
  @IsUUID()
  userId: string;
}

export class EnablePushNotificationPayload extends DefaultPushNotificationPayload {
  @IsObject()
  @Type(() => AcceptNotificationDto)
  @IsOptional()
  acceptNotificationDto?: AcceptNotificationDto;
}

export class DisablePushNotificationPayload extends DefaultPushNotificationPayload {}
