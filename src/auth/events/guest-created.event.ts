import { IsOptional, IsString, IsUUID } from "class-validator";

import type { EventBody } from "@/_common/types/events.types";
import { GuestEventTypes } from "@/auth/events/auth.events";
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
