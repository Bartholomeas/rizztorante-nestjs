import { Injectable } from "@nestjs/common";

import { StripeService } from "@/payments/stripe/stripe.service";

@Injectable()
export class PaymentsService {
  constructor(private readonly stripeService: StripeService) {}

  async createPayment() {
    console.log("syszysz mniew?: ", StripeService);
    return this.stripeService.createPayment();
  }
}
