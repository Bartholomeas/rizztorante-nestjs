import { DynamicModule, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { STRIPE_KEY } from "./stripe.constants";
import { StripeService } from "./stripe.service";

@Module({})
export class StripeModule {
  static forRootAsync(): DynamicModule {
    return {
      module: StripeModule,
      imports: [
        ConfigModule.forRoot({
          envFilePath: [".env"],
          isGlobal: true,
        }),
      ],
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
