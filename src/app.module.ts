import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { TypeOrmModule } from "@nestjs/typeorm";

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

import { RedisModule } from "./libs/redis/redis.module";

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
    RedisModule,
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
  // export class AppModule implements NestModule {
  // constructor(
  //   @Inject(REDIS) private readonly redisClient: Redis,
  //   private readonly configService: ConfigService,
  // ) {}
  // configure(consumer: MiddlewareConsumer) {
  //   const redisStore = new (RedisStore(session))({
  //     client: this.redisClient,
  //     port: 6379,
  //     logErrors: true,
  //   });
  //   consumer
  //     .apply(
  //       session({
  //         store: redisStore,
  //         secret: this.configService.get<string>("SESSION_SECRET"),
  //         name: this.configService.get<string>("SESSION_NAME"),
  //         resave: false,
  //         saveUninitialized: false,
  //         cookie: {
  //           httpOnly: true,
  //           maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
  //         },
  //       }),
  //       passportInitialize(),
  //       passportSession(),
  //     )
  //     .forRoutes("*");
  // }
}
