import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import * as session from "express-session";
import * as passport from "passport";

import { AppModule } from "./app.module";
import { APP_NAME } from "./constants";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api/v1");
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
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

  await app.listen(8080);
}

bootstrap();
