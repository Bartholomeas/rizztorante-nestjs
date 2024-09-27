import * as path from "node:path";

import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import * as firebase from "firebase-admin";
import { Repository } from "typeorm";

import { UserRole } from "@common/types/user-roles.type";

import { AcceptNotificationDto } from "./dto/accept-notification.dto";
import { UpdateNotificationDto } from "./dto/update-notification.dto";
import { NotificationToken } from "./entities/notification-token.entity";
import { Notification } from "./entities/notification.entity";
import { NotificationStatus } from "./enums/notification-status.enum";

firebase.initializeApp({
  credential: firebase.credential.cert(
    path.join(process.cwd(), "src", "notifications", "firebase-adminsdk.json"),
  ),
});

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(NotificationToken)
    private readonly notificationTokenRepository: Repository<NotificationToken>,
  ) {}

  async acceptPushNotification(
    userId: string,
    accetNotificationDto: AcceptNotificationDto,
  ): Promise<NotificationToken> {
    await this.notificationTokenRepository.update(
      { user: { id: userId } },
      { status: NotificationStatus.INACTIVE },
    );

    return await this.notificationTokenRepository.save({
      user: { id: userId },
      deviceType: accetNotificationDto.deviceType,
      token: accetNotificationDto.notificationToken,
      status: NotificationStatus.ACTIVE,
    });
  }

  async disablePushNotification(userId: string, updateDto: UpdateNotificationDto): Promise<void> {
    await this.notificationTokenRepository.update(
      {
        user: { id: userId },
        deviceType: updateDto.deviceType,
      },
      { status: NotificationStatus.INACTIVE },
    );
  }

  async getNotifications(): Promise<Notification[]> {
    return await this.notificationRepository.find();
  }

  async sendPush(userId: string, title: string, body: string): Promise<void> {
    const notificationToken = await this.notificationTokenRepository.findOne({
      where: { user: { id: userId }, status: NotificationStatus.ACTIVE },
    });
    if (!notificationToken)
      throw new NotFoundException(`No notification token found for user ${userId}`);

    await this.notificationRepository.save({
      notificationTokens: [notificationToken],
      title,
      body,
      status: NotificationStatus.ACTIVE,
      createdBy: userId,
    });

    await firebase.messaging().send({
      notification: { title, body },
      token: notificationToken.token,
      android: { priority: "high" },
    });
  }

  async sendPushToRole(role: UserRole, title: string, body: string): Promise<void> {
    const notificationTokens = await this.notificationTokenRepository.find({
      where: { user: { role }, status: NotificationStatus.ACTIVE },
    });

    if (!notificationTokens?.length)
      throw new NotFoundException(`No notification tokens found for role ${role}`);

    await this.notificationRepository.save({
      notificationTokens,
      body,
      title,
      status: NotificationStatus.ACTIVE,
      createdBy: "system",
    });

    await firebase.messaging().sendEachForMulticast({
      notification: { title, body },
      tokens: notificationTokens.map((token) => token.token),
      android: { priority: "high" },
    });
  }
}
