import type { SessionContent } from "@/auth/sessions/types/session.types";

import type { Event } from "../../common/types/events.types";

export enum GuestEventTypes {
  CREATED = "guest.created",
  SESSION_CREATED = "guest.session.created",
}

export class GuestCreatedPayload {
  constructor(
    public readonly userId?: string,
    public readonly sessionId?: string,
  ) {}
}

export type GuestCreatedEvent = Event<typeof GuestEventTypes.CREATED, GuestCreatedPayload>;
export type GuestSessionCreatedEvent = Event<
  typeof GuestEventTypes.SESSION_CREATED,
  SessionContent
>;
