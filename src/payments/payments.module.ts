import { Module } from "@nestjs/common";

import { StripeModule } from "@/payments/stripe/stripe.module";

@Module({
  imports: [StripeModule.forRootAsync()],
})
export class PaymentsModule {}
