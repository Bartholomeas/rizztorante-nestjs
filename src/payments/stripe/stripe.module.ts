import { DynamicModule, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { OrdersModule } from "@/orders/orders.module";

import { STRIPE_KEY } from "./stripe.constants";
import { StripeController } from "./stripe.controller";
import { StripeService } from "./stripe.service";

@Module({
  imports: [OrdersModule],
  controllers: [StripeController],
})
export class StripeModule {
  static forRootAsync(): DynamicModule {
    return {
      module: StripeModule,
      providers: [
        StripeService,
        {
          provide: STRIPE_KEY,
          useFactory: async (configService: ConfigService) => configService.get<string>(STRIPE_KEY),
          inject: [ConfigService],
        },
      ],
      exports: [StripeService],
    };
  }
}
