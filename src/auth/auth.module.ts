import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { ScheduleModule } from "@nestjs/schedule";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Cart } from "@/cart/entity/cart.entity";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { User } from "./entity/user.entity";
import { SessionEntity } from "./session/entity/session.entity";
import { SessionSerializer } from "./session/session.serializer";
import { SessionService } from "./session/session.service";
import { LocalStrategy } from "./strategy/local.strategy";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, SessionEntity, Cart]),
    PassportModule.register({ session: true }),
    ScheduleModule.forRoot(),
  ],
  providers: [AuthService, LocalStrategy, SessionSerializer, SessionService],
  controllers: [AuthController],
})
export class AuthModule {}
