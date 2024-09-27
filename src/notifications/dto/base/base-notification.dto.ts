import { IsEnum } from "class-validator";

import { NotificationDevice } from "@/notifications/enums/notification-device.enum";

export abstract class BaseNotificationDto {
  @IsEnum(NotificationDevice)
  deviceType?: NotificationDevice = NotificationDevice.ANDROID;
}
