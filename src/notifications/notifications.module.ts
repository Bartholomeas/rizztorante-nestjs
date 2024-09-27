import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { User } from "@/users/entities/user.entity";

import { NotificationToken } from "./entities/notification-token.entity";
import { Notification } from "./entities/notification.entity";
import { FirebaseAdminProvider } from "./firebase-admin.provider";
import { NotificationsController } from "./notifications.controller";
import { NotificationsListener } from "./notifications.listener";
import { NotificationsService } from "./notifications.service";

@Module({
  imports: [TypeOrmModule.forFeature([Notification, NotificationToken, User])],
  providers: [FirebaseAdminProvider, NotificationsService, NotificationsListener],
  controllers: [NotificationsController],
})
export class NotificationsModule {}
