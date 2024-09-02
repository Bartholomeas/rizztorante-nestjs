import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";

import { IsNull, LessThan, Not, Repository } from "typeorm";

import { SessionEntity } from "./entity/session.entity";

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(SessionEntity) private readonly sessionRepository: Repository<SessionEntity>,
  ) {}

  @Cron(CronExpression.EVERY_12_HOURS)
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
