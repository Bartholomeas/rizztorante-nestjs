import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import * as compression from "compression";
import * as connectRedis from "connect-redis";
import * as session from "express-session";
import { default as Redis } from "ioredis";

import { GlobalExceptionFilter } from "@common/filters/global-exception.filter";
import { LoggingInterceptor } from "@common/interceptors/logging.interceptor";

import { APP_NAME } from "./_common/constants";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    bufferLogs: true,
  });

  app.setGlobalPrefix("api/v1");
  app.use(compression());
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle(APP_NAME)
    .setDescription("API for handling orders in restaurant")
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  const configService = app.get(ConfigService);

  const RedisStore = connectRedis(session);
  const redisClient = new Redis({
    username: "default",
    port: +configService.get<number>("REDIS_PORT"),
    host: configService.get<string>("REDIS_HOST"),
    password: configService.get<string>("REDIS_PASSWORD"),
  });

  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      secret: configService.get<string>("SESSION_SECRET"),
      name: configService.get<string>("SESSION_NAME"),
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      },
    }),
  );

  await app.listen(configService.get<number>("APP_API_PORT"));
}

bootstrap();
