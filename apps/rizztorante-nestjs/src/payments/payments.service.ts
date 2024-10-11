import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";

import { StripeService } from "@app/restaurant/payments/stripe/stripe.service";

import { PaymentsEventTypes } from "@events/events";
import { InitPaymentPayload } from "@events/payloads";

@Injectable()
export class PaymentsService {
  constructor(private readonly stripeService: StripeService) {}

  @OnEvent(PaymentsEventTypes.INIT_PAYMENT)
  async createPayment(payload: InitPaymentPayload) {
    return this.stripeService.createPayment<InitPaymentPayload["checkoutData"]>(
      payload.lineItems,
      payload.checkoutData,
    );
  }
}
