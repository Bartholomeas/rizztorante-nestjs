import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { ThrottlerModule } from "@nestjs/throttler";
import { TypeOrmModule } from "@nestjs/typeorm";

import { dataSourceOptions } from "database/data-source";
import { LoggerModule } from "nestjs-pino";

import { AppController } from "@/app.controller";
import { AppService } from "@/app.service";
import { AuthModule } from "@/auth/auth.module";
import { CartModule } from "@/cart/cart.module";
import { CheckoutModule } from "@/checkout/checkout.module";
import { IngredientsModule } from "@/ingredients/ingredients.module";
import { MenuModule } from "@/menu/menu.module";
import { NotificationsModule } from "@/notifications/notifications.module";
import { OpinionsModule } from "@/opinions/opinions.module";
import { OrdersModule } from "@/orders/orders.module";
import { PaymentsModule } from "@/payments/payments.module";
import { RestaurantConfigModule } from "@/restaurant-config/restaurant-config.module";
import { RestaurantsModule } from "@/restaurants/restaurants.module";
import { UploadsModule } from "@/uploads/uploads.module";
import { UsersModule } from "@/users/users.module";

import { JwtGuard } from "./auth/guards/jwt.guard";
import { JwtStrategy } from "./auth/strategies/jwt.strategy";
import { RedisModule } from "./libs/redis/redis.module";
import { BullModule } from "@nestjs/bullmq";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ["./.env"],
      isGlobal: true,
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: "pino-pretty",
          options: {
            level: "info",
            singleLine: true,
            colorize: true,
            translateTime: "SYS:standard",
            ignore: "pid,hostname",
            messageFormat: "{context}",
          },
        },
        autoLogging: false,
        serializers: {
          req: () => undefined,
          res: () => undefined,
        },
        customProps: () => ({
          context: "HTTP",
        }),
      },
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    ThrottlerModule.forRoot([
      {
        ttl: 6000,
        limit: 500,
      },
    ]),
    BullModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get("REDIS_HOST"),
          port: configService.get("REDIS_PORT"),
          username: configService.get("REDIS_USERNAME"),
          password: configService.get("REDIS_PASSWORD"),
        },
      }),
      inject: [ConfigService],
    }),
    EventEmitterModule.forRoot({ delimiter: "." }),
    RedisModule,
    AuthModule,
    UsersModule,
    RestaurantConfigModule,
    IngredientsModule,
    MenuModule,
    OrdersModule,
    CartModule,
    CheckoutModule,
    OpinionsModule,
    PaymentsModule,
    UploadsModule,
    NotificationsModule,
    RestaurantsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    JwtStrategy,
  ],
})
export class AppModule {}
