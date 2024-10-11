import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AppController } from "@app/restaurant/app.controller";
import { AppService } from "@app/restaurant/app.service";
import { AuthModule } from "@app/restaurant/auth/auth.module";
import { CartModule } from "@app/restaurant/cart/cart.module";
import { CheckoutModule } from "@app/restaurant/checkout/checkout.module";
import { IngredientsModule } from "@app/restaurant/ingredients/ingredients.module";
import { MenuModule } from "@app/restaurant/menu/menu.module";
import { OpinionsModule } from "@app/restaurant/opinions/opinions.module";
import { OrdersModule } from "@app/restaurant/orders/orders.module";
import { PaymentsModule } from "@app/restaurant/payments/payments.module";
import { RestaurantConfigModule } from "@app/restaurant/restaurant-config/restaurant-config.module";
import { UploadsModule } from "@app/restaurant/uploads/uploads.module";
import { UsersModule } from "@app/restaurant/users/users.module";
import { LoggerModule } from "nestjs-pino";

import { RestaurantsModule } from "@app/admin/restaurants/restaurants.module";

import { NotificationsModule } from "./notifications/notifications.module";
import { EmployeesModule } from "../../admin-app/src/employees/employees.module";

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
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST ?? "localhost",
      port: parseInt(process.env.APP_DB_PORT ?? "5432"),
      username: process.env.APP_DB_USERNAME,
      password: process.env.APP_DB_PASSWORD,
      database: process.env.APP_DB_NAME,
      synchronize: process.env.NODE_ENV !== "production",
      // logging: process.env.NODE_ENV !== "production",
      autoLoadEntities: true,
      // cache: {
      //   duration: 1000 * 60 * 5,
      // },
      // dropSchema: true, //To clearing DB in each app restart
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 6000,
        limit: 500,
      },
    ]),
    EventEmitterModule.forRoot({ delimiter: "." }),
    AuthModule,
    UsersModule,
    RestaurantConfigModule,
    RestaurantsModule,
    EmployeesModule,
    IngredientsModule,
    MenuModule,
    OrdersModule,
    CartModule,
    CheckoutModule,
    OpinionsModule,
    PaymentsModule,
    UploadsModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {
  constructor() {}
}
