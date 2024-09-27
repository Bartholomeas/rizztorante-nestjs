import { IsEnum, IsNotEmpty, IsString } from "class-validator";

import { NotificationStatus } from "../enums/notification-status.enum";
import { BaseNotificationDto } from "./base/base-notification.dto";

export class AcceptNotificationDto extends BaseNotificationDto {
  @IsString()
  @IsNotEmpty()
  notificationToken: string;

  @IsEnum(NotificationStatus)
  notificationStatus: NotificationStatus;
}
