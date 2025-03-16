import * as crypto from "node:crypto";

import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";

import { RemovePasswordUtils } from "@common/utils/remove-password.utils";

import {
  disableNotificationEvent,
  enableNotificationEvent,
} from "@events/payloads/notifications/notifications.events";

import { User } from "@/users/entities/user.entity";
import { USER_REPOSITORY_DI, UserRepository } from "../repositories/user.repository";

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY_DI)
    private readonly userRepository: UserRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async getCurrentUser(userId: string | undefined): Promise<Omit<User, "password">> {
    if (!userId) throw new NotFoundException("User ID is required");
    const user = await this.userRepository.findUserById(userId);
    if (!user) throw new NotFoundException("User not found");

    return RemovePasswordUtils.removePasswordFromResponse(user);
  }

  async enablePushNotification(userId: string): Promise<void> {
    const user = await this.userRepository.findUserById(userId);
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
    const user = await this.userRepository.findUserById(userId);
    if (!user) throw new NotFoundException("User not found");
    await this.eventEmitter.emitAsync(
      ...disableNotificationEvent({
        userId: userId,
      }),
    );

    await this.userRepository.save(user);
  }
}
