import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import Redis from "ioredis";

import { REDIS } from "./redis.constants";

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: REDIS,
      useFactory: (configService: ConfigService) => {
        const redisPort = configService.get<number>("REDIS_PORT", 6379);
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
  ],
  exports: [REDIS],
})
export class RedisModule {}
