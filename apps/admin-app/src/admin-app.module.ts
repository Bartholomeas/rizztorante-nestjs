import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";
import { TypeOrmModule } from "@nestjs/typeorm";

import { LoggerModule } from "nestjs-pino";

import { AdminAppController } from "./admin-app.controller";
import { AdminAppService } from "./admin-app.service";
import { AuthModule } from "./auth/auth.module";
import { EmployeesModule } from "./employees/employees.module";
import { RestaurantsModule } from "./restaurants/restaurants.module";

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
    AuthModule,
    EmployeesModule,
    RestaurantsModule,
  ],
  controllers: [AdminAppController],
  providers: [AdminAppService],
})
export class AdminAppModule {}
