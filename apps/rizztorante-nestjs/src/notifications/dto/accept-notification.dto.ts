import { IsOptional, IsString } from "class-validator";

import { BaseNotificationDto } from "./base/base-notification.dto";

export class AcceptNotificationDto extends BaseNotificationDto {
  @IsString()
  @IsOptional()
  notificationToken?: string;

  // @IsEnum(NotificationStatus)
  // notificationStatus: NotificationStatus;
}
