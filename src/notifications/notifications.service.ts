import { UserRole } from "@common/types/user-roles.type";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as crypto from "crypto";
import * as firebase from "firebase-admin";
import { Repository } from "typeorm";

import { AcceptNotificationDto } from "./dto/accept-notification.dto";
import { CreateGuestNotificationToken } from "./dto/create-guest-notification-token.dto";
import { CreateNotificationDto } from "./dto/create-notification.dto";
import { NotificationToken } from "./entities/notification-token.entity";
import { Notification } from "./entities/notification.entity";
import { NotificationStatus } from "./enums/notification-status.enum";

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
    acceptNotificationDto: AcceptNotificationDto,
  ): Promise<NotificationToken> {
    await this.notificationTokenRepository.update(
      { user: { id: userId } },
      { status: NotificationStatus.INACTIVE },
    );

    let token = await this.notificationTokenRepository.findOne({
      where: {
        user: { id: userId },
        deviceType: acceptNotificationDto.deviceType,
      },
    });

    if (!token)
      token = this.notificationTokenRepository.create({
        user: { id: userId },
        deviceType: acceptNotificationDto.deviceType,
      });

    token.token = acceptNotificationDto?.notificationToken ?? crypto.randomUUID();
    token.status = NotificationStatus.ACTIVE;

    return await this.notificationTokenRepository.save(token);
  }

  async disablePushNotification(userId: string): Promise<void> {
    await this.notificationTokenRepository.update(
      {
        user: { id: userId },
        // deviceType: updateDto.deviceType,
      },
      { status: NotificationStatus.INACTIVE },
    );
  }

  async getNotifications(): Promise<Notification[]> {
    return await this.notificationRepository.find();
  }

  async sendPush(userId: string, { title, body }: CreateNotificationDto): Promise<void> {
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

  async sendPushToRole(role: UserRole, { title, body }: CreateNotificationDto): Promise<void> {
    const notificationTokens = await this.notificationTokenRepository.find({
      where: { user: { role }, status: NotificationStatus.ACTIVE },
    });

    if (!notificationTokens?.length)
      throw new NotFoundException(`No notification tokens found for role ${role}`);

    const newNotification = this.notificationRepository.create({
      notificationTokens,
      body,
      title,
      status: NotificationStatus.ACTIVE,
      createdBy: "system",
    });

    await this.notificationRepository.save(newNotification);

    const tokens = notificationTokens.map((token) => token.token);
    await firebase.messaging().sendEachForMulticast({
      notification: { title, body },
      tokens,
      android: { priority: "high" },
    });
  }

  async createGuestNotificationToken(
    userId: string,
    { deviceType }: CreateGuestNotificationToken,
  ): Promise<NotificationToken> {
    const token = this.notificationTokenRepository.create({
      user: { id: userId },
      deviceType,
      token: userId,
      status: NotificationStatus.INACTIVE,
    });
    return await this.notificationTokenRepository.save(token);
  }
}
