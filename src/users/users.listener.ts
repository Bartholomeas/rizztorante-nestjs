import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";

import { UserEventTypes } from "@events/events";

import { UsersService } from "./services/users.service";

@Injectable()
export class UsersListener {
  constructor(private readonly usersService: UsersService) {}

  @OnEvent(UserEventTypes.GET_USER_PROFILE)
  async getUserProfile(userId: string) {
    return await this.usersService.getCurrentUser(userId);
  }
}
