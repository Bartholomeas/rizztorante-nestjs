import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { MenuModule } from "@/menu/menu.module";
import { OrdersModule } from "@/orders/orders.module";
import { CartModule } from "@/cart/cart.module";
import { AppController } from "@/app.controller";
import { AppService } from "@/app.service";

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
      synchronize: true, // TODO: probably to delete in production
      autoLoadEntities: true,
    }),
    OrdersModule,
    MenuModule,
    CartModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor() {}
}
