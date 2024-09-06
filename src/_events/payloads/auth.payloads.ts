import { IsOptional, IsString, IsUUID } from "class-validator";

import { GuestEventTypes } from "@events/events";
import { EventBody } from "@events/events.types";

import type { SessionContent } from "@/auth/sessions/types/session.types";

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
  typeof GuestEventTypes.SESSION_CREATED,
  SessionContent
>;
