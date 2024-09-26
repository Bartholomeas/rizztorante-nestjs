import { Injectable, NotImplementedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import * as firebase from "firebase-admin";

import { NotificationToken } from "./entities/notification-token.entity";
import { Notification } from "./entities/notification.entity";

firebase.initializeApp({});

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification) private readonly notificationRepository,
    @InjectRepository(NotificationToken) private readonly notificationTokenRepository,
  ) {}

  async acceptPushNotification(
    user: unknown,
    notificationDto: unknown,
  ): Promise<NotificationToken> {
    console.log(user, notificationDto);
    throw new NotImplementedException();
  }

  async disablePushNotification(user: unknown, updateDto: unknown): Promise<NotificationToken> {
    console.log(user, updateDto);
    throw new NotImplementedException();
  }

  async getNotifications() {}

  async sendPush(user: unknown, title: string, body: string): Promise<void> {
    console.log(user, title, body);
    throw new NotImplementedException();
  }
}
