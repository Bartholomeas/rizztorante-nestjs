import { ApiProperty } from "@nestjs/swagger";

import { IsEnum } from "class-validator";

import { NotificationDevice } from "@/notifications/enums/notification-device.enum";

export abstract class BaseNotificationDto {
  @ApiProperty({ enum: NotificationDevice })
  @IsEnum(NotificationDevice)
  deviceType: NotificationDevice;
}
