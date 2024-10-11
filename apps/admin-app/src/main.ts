import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { SessionEntity } from "@app/restaurant/auth/sessions/entity/session.entity";
import compression from "compression";
import { TypeormStore } from "connect-typeorm";
import session from "express-session";
import passport from "passport";
import { DataSource } from "typeorm";

import { GlobalExceptionFilter } from "@common/filters/global-exception.filter";
import { LoggingInterceptor } from "@common/interceptors/logging.interceptor";

import { AdminAppModule } from "./admin-app.module";

async function bootstrap() {
  const app = await NestFactory.create(AdminAppModule);
  const dataSource = app.get(DataSource);
  const sessionRepository = dataSource.getRepository(SessionEntity);

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
  // app.use(app.get(Logger));
  app.use(
    session({
      name: process.env.SESSION_NAME,
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false, //TODO: For testing purposes, turn false after that

      cookie: {
        httpOnly: true,
        // secure: "auto",
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
        // sameSite: "strict",
      },
      store: new TypeormStore({
        cleanupLimit: 2,
        limitSubquery: false,
        resave: false,
        ttl: 1000 * 60 * 60 * 24 * 30,
        rolling: true,
      }).connect(sessionRepository),
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  const config = new DocumentBuilder()
    .setTitle("Rizztorante Admin")
    .setDescription("API for handling orders in restaurant")
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  // const configService = app.get(ConfigService);
  await app.listen(3001);
  // await app.listen(configService.get<number>("APP_API_PORT"));
}

bootstrap();
