import { UserEventTypes } from "@events/events";
import { GuestSessionCreatedEvent } from "@events/payloads";
import { Injectable, NestMiddleware } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { NextFunction, Request, Response } from "express";

import { SessionContent } from "@/auth/sessions/types/session.types";

@Injectable()
export class GuestUserMiddleware implements NestMiddleware {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const session = req?.session as unknown as SessionContent | undefined;

    if (!session?.passport?.user) {
      const guestCreatedEvent: GuestSessionCreatedEvent = {
        type: UserEventTypes.SESSION_CREATED,
        payload: session,
      };
      await this.eventEmitter.emitAsync(guestCreatedEvent.type, guestCreatedEvent.payload);
    }

    next();
  }
}
