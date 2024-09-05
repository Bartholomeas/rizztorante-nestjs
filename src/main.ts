import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import * as compression from "compression";
import { TypeormStore } from "connect-typeorm";
import * as session from "express-session";
import * as passport from "passport";
import { DataSource } from "typeorm";

import { SessionEntity } from "@/auth/sessions/entity/session.entity";

import { AppModule } from "./app.module";
import { APP_NAME } from "./common/constants";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const dataSource = app.get(DataSource);
  const sessionRepository = dataSource.getRepository(SessionEntity);

  app.setGlobalPrefix("api/v1");
  app.use(compression());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.use(
    session({
      name: process.env.SESSION_NAME,
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false, //TODO: For testing purposes, turn false after that

      cookie: {
        httpOnly: true,
        // secure: "auto",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        // sameSite: "strict",
      },
      store: new TypeormStore({
        cleanupLimit: 2,
        limitSubquery: false,
        resave: false,
        ttl: 1000 * 5,
      }).connect(sessionRepository),
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  const config = new DocumentBuilder()
    .setTitle(APP_NAME)
    .setDescription("API for handling orders in restaurant")
    .setVersion("1.0")
    .addTag("restaurant")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  await app.listen(process.env.APP_PORT);
}

bootstrap();
