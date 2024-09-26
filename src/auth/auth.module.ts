import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { ScheduleModule } from "@nestjs/schedule";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthListener } from "@/auth/auth.listener";
import { User } from "@/auth/entities/user.entity";
import { SessionEntity } from "@/auth/sessions/entity/session.entity";
import { SessionSerializer } from "@/auth/sessions/session.serializer";
import { SessionService } from "@/auth/sessions/session.service";
import { LocalStrategy } from "@/auth/strategies/local.strategy";
import { Cart } from "@/cart/entities/cart.entity";
import { NotificationToken } from "@/notifications/entities/notification-token.entity";
import { Order } from "@/orders/entities/order.entity";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, SessionEntity, Cart, Order, NotificationToken]),
    PassportModule.register({ session: true }),
    ScheduleModule.forRoot(),
  ],
  providers: [AuthService, LocalStrategy, SessionSerializer, SessionService, AuthListener],
  controllers: [AuthController],
})
export class AuthModule {}
