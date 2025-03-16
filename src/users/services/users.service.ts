import * as crypto from "node:crypto";

import { Injectable, NotFoundException } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";

import { RemovePasswordUtils } from "@common/utils/remove-password.utils";

import {
  disableNotificationEvent,
  enableNotificationEvent,
} from "@events/payloads/notifications/notifications.events";

import { User } from "@/users/entities/user.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async getCurrentUser(userId: string | undefined): Promise<Omit<User, "password">> {
    if (!userId) throw new NotFoundException("User ID is required");
    const user = await this.userRepository.findOne({
      where: { id: userId },
      cache: { id: `user-${userId}`, milliseconds: 1000 * 60 },
    });
    if (!user) throw new NotFoundException("User not found");

    return RemovePasswordUtils.removePasswordFromResponse(user);
  }

  async enablePushNotification(userId: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException("User not found");

    await this.eventEmitter.emitAsync(
      ...enableNotificationEvent({
        userId,
        acceptNotificationDto: {
          notificationToken: crypto.randomUUID(),
        },
      }),
    );

    await this.userRepository.save(user);
  }

  async disablePushNotification(userId: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException("User not found");
    await this.eventEmitter.emitAsync(
      ...disableNotificationEvent({
        userId: userId,
      }),
    );

    await this.userRepository.save(user);
  }
}
