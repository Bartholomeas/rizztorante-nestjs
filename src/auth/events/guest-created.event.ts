import { IsOptional, IsString, IsUUID } from "class-validator";

import { GuestEventTypes } from "@/auth/events/auth.events";
import type { SessionContent } from "@/auth/sessions/types/session.types";
import type { EventBody } from "@/common/types/events.types";

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
