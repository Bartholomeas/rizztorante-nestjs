import { Injectable, NestMiddleware } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";

import { SessionContent } from "@app/restaurant/auth/sessions/types/session.types";
import { NextFunction, Request, Response } from "express";

import { UserEventTypes } from "@events/events";
import { GuestSessionCreatedEvent } from "@events/payloads";

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
