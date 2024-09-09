import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";

import { CheckoutEventTypes } from "@events/events";

import { AuthService } from "@/auth/auth.service";

@Injectable()
export class AuthListener {
  constructor(private readonly authService: AuthService) {}

  @OnEvent(CheckoutEventTypes.GET_USER_PROFILE)
  async getUserProfile(userId: string) {
    return await this.authService.getUserProfile(userId);
  }
}
