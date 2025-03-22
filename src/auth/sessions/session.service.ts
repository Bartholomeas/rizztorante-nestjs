import { UserEventTypes } from "@events/events";
import { GuestCreatedPayload } from "@events/payloads";
import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Cron, CronExpression } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, LessThan, Not, Repository } from "typeorm";

import { SessionContent } from "@/auth/sessions/types/session.types";
import { User } from "@/users/entities/user.entity";

import { SessionEntity } from "./entity/session.entity";

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(SessionEntity) private readonly sessionRepository: Repository<SessionEntity>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  // @OnEvent(UserEventTypes.SESSION_CREATED)
  async addGuestToSession(session: SessionContent) {
    const [user]: User[] = await this.eventEmitter.emitAsync(
      UserEventTypes.GUEST_CREATED,
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
