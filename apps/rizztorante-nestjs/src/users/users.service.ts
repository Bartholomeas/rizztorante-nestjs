import * as crypto from "node:crypto";

import { Injectable, NotFoundException } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { InjectRepository } from "@nestjs/typeorm";

import { User } from "@app/restaurant/users/entities/user.entity";
import { RemovePasswordUtils } from "libs/shared/utils/remove-password.utils";
import { Repository } from "typeorm";

import {
  disableNotificationEvent,
  enableNotificationEvent,
} from "@events/payloads/notifications/notifications.events";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async getCurrentUser(userId: string | undefined): Promise<Omit<User, "password">> {
    if (!userId) throw new NotFoundException("User ID is required");
    const user = await this.userRepository.findOne({ where: { id: userId } });
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
