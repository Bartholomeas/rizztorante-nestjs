export enum GuestEvents {
  GUEST_CREATED = "guest.created",
  GUEST_SESSION_CREATED = "guest.session.created",
}

export class GuestCreatedEvent {
  constructor(
    public readonly userId?: string,
    public readonly sessionId?: string,
  ) {}
}
