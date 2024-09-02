import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { ScheduleModule } from "@nestjs/schedule";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { User } from "./entity/user.entity";
import { SessionEntity } from "./session/entity/session.entity";
import { SessionCronService } from "./session/session-cron.service";
import { SessionSerializer } from "./session/session.serializer";
import { LocalStrategy } from "./strategy/local.strategy";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, SessionEntity]),
    PassportModule.register({ session: true }),
    ScheduleModule.forRoot(),
  ],
  providers: [AuthService, LocalStrategy, SessionSerializer, SessionCronService],
  controllers: [AuthController],
})
export class AuthModule {}
