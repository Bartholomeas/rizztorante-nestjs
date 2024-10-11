import { NotificationDevice } from "@app/restaurant/notifications/enums/notification-device.enum";
import { IsEnum } from "class-validator";

export abstract class BaseNotificationDto {
  @IsEnum(NotificationDevice)
  deviceType?: NotificationDevice = NotificationDevice.ANDROID;
}
