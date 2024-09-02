import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AppController } from "@/app.controller";
import { AppService } from "@/app.service";
import { CartModule } from "@/cart/cart.module";
import { MenuModule } from "@/menu/menu.module";
import { OrdersModule } from "@/orders/orders.module";

import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [".env"],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: parseInt(process.env.DB_PORT ?? "5432"),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: process.env.NODE_ENV !== "production",
      logging: process.env.NODE_ENV !== "production",
      autoLoadEntities: true,
      // dropSchema: true, //To clearing DB in each app restart
    }),
    OrdersModule,
    MenuModule,
    CartModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor() {}
}
