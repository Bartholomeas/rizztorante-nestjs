import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import * as connectRedis from "connect-redis";
import * as session from "express-session";
import { default as Redis } from "ioredis";

import { REDIS, REDIS_STORE } from "./redis.constants";

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: REDIS,
      useFactory: (configService: ConfigService) => {
        const redisPort = +configService.get<number>("REDIS_PORT", 6379);
        const redisHost = configService.get<string>("REDIS_HOST", "localhost");
        const redisPassword = configService.get<string>("REDIS_PASSWORD");

        return new Redis({
          host: redisHost,
          port: redisPort,
          username: "default",
          password: redisPassword,
        });
      },
      inject: [ConfigService],
    },
    {
      provide: REDIS_STORE,
      useFactory: (redisClient: Redis) => {
        const RedisStore = connectRedis(session);
        return new RedisStore({ client: redisClient });
      },
      inject: [REDIS],
    },
  ],
  exports: [REDIS, REDIS_STORE],
})
export class RedisModule {}
