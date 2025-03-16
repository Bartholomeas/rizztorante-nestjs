import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import type { NestFastifyApplication } from "@nestjs/platform-fastify";
import { FastifyAdapter } from "@nestjs/platform-fastify";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import secureSession from "@fastify/secure-session";
import * as compression from "compression";

import { GlobalExceptionFilter } from "@common/filters/global-exception.filter";
import { LoggingInterceptor } from "@common/interceptors/logging.interceptor";

import { APP_NAME } from "./_common/constants";
import { AppModule } from "./app.module";

async function bootstrap() {
  const fastifyAdapter = new FastifyAdapter();
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, fastifyAdapter, {
    cors: true,
    bufferLogs: true,
    logger: ["error", "warn", "log", "debug", "verbose"],
  });

  const configService = app.get(ConfigService);

  app.setGlobalPrefix("api/v1");

  await app.register(secureSession, {
    secret: configService.get<string>("SESSION_SECRET"),
    salt: configService.get<string>("SESSION_SALT"),
  });

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

  await app.listen(configService.get<number>("APP_API_PORT"), "0.0.0.0");
}

bootstrap();
