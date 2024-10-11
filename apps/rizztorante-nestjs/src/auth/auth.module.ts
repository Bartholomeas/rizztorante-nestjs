import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { ScheduleModule } from "@nestjs/schedule";
import { TypeOrmModule } from "@nestjs/typeorm";

import { SessionEntity } from "@app/restaurant/auth/sessions/entity/session.entity";
import { SessionSerializer } from "@app/restaurant/auth/sessions/session.serializer";
import { SessionService } from "@app/restaurant/auth/sessions/session.service";
import { LocalStrategy } from "@app/restaurant/auth/strategies/local.strategy";
import { Cart } from "@app/restaurant/cart/entities/cart.entity";
import { NotificationToken } from "@app/restaurant/notifications/entities/notification-token.entity";
import { Order } from "@app/restaurant/orders/entities/order.entity";
import { User } from "@app/restaurant/users/entities/user.entity";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, SessionEntity, Cart, Order, NotificationToken]),
    PassportModule.register({ session: true }),
    ScheduleModule.forRoot(),
  ],
  providers: [AuthService, LocalStrategy, SessionSerializer, SessionService],
  controllers: [AuthController],
})
export class AuthModule {}
