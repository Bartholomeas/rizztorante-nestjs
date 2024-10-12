import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import * as compression from "compression";

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

  await app.listen(configService.get<number>("APP_API_PORT"));
}

bootstrap();
