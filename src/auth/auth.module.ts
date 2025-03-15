import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ScheduleModule } from "@nestjs/schedule";
import { TypeOrmModule } from "@nestjs/typeorm";

import { SessionEntity } from "@/auth/sessions/entity/session.entity";
import { SessionSerializer } from "@/auth/sessions/session.serializer";
import { SessionService } from "@/auth/sessions/session.service";
import { LocalStrategy } from "@/auth/strategies/local.strategy";
import { Cart } from "@/cart/entities/cart.entity";
import { NotificationToken } from "@/notifications/entities/notification-token.entity";
import { Order } from "@/orders/entities/order.entity";
import { User } from "@/users/entities/user.entity";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./strategies/jwt.strategy";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, SessionEntity, Cart, Order, NotificationToken]),
    PassportModule.register({ session: true }),
    ScheduleModule.forRoot(),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
        signOptions: {
          expiresIn: parseInt(
            configService.getOrThrow<string>("ACCESS_TOKEN_VALIDITY_DURATION_IN_SECONDS"),
          ),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, SessionSerializer, SessionService],
  controllers: [AuthController],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
