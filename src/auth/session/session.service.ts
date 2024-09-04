import { Injectable } from "@nestjs/common";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { Cron, CronExpression } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";

import { IsNull, LessThan, Not, Repository } from "typeorm";

import { User } from "@/auth/entity/user.entity";
import { SessionContent } from "@/auth/session/types/session.types";

import { SessionEntity } from "./entity/session.entity";
import { GuestCreatedPayload, GuestEventTypes } from "../../shared/events/guest-created.event";

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(SessionEntity) private readonly sessionRepository: Repository<SessionEntity>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @OnEvent(GuestEventTypes.SESSION_CREATED)
  async addGuestToSession(session: SessionContent) {
    const [user]: User[] = await this.eventEmitter.emitAsync(
      GuestEventTypes.CREATED,
      new GuestCreatedPayload(session?.passport?.user?.id, session?.id),
    );
    session.passport = {
      user,
    };
    return user;
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async handleSessionCleanup() {
    console.log("Cleaning up sessions");
    try {
      await this.sessionRepository.delete({
        deletedAt: Not(IsNull()),
        expiredAt: LessThan(Date.now()) || IsNull(),
      });
    } catch (err) {
      console.error("Error cleaning up sessions:", err);
    }
  }
}
