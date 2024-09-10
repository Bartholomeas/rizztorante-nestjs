import { IsOptional, IsString, IsUUID } from "class-validator";

import { UserEventTypes } from "@events/events";
import { EventBody } from "@events/events.types";

import type { SessionContent } from "@/auth/sessions/types/session.types";

export type UserEventPayloads = {
  [UserEventTypes.GET_USER_PROFILE]: string;
  [UserEventTypes.GUEST_CREATED]: GuestCreatedPayload;
  [UserEventTypes.SESSION_CREATED]: string;
};

export class GuestCreatedPayload {
  @IsUUID()
  @IsOptional()
  public readonly userId?: string;

  @IsOptional()
  @IsString()
  public readonly sessionId?: string;

  constructor(userId?: string, sessionId?: string) {
    this.userId = userId;
    this.sessionId = sessionId;
  }
}

export type GuestSessionCreatedEvent = EventBody<
  typeof UserEventTypes.SESSION_CREATED,
  SessionContent
>;
