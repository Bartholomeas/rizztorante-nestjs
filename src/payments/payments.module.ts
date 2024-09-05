import { Module } from "@nestjs/common";

import { StripeModule } from "@/payments/stripe/stripe.module";

import { PaymentsService } from "./payments.service";

@Module({
  imports: [StripeModule.forRootAsync()],
  providers: [PaymentsService],
})
export class PaymentsModule {}
