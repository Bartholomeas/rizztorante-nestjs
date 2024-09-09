import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";

import { CheckoutEventTypes } from "@events/events";
import { CheckoutPaymentPayload } from "@events/payloads";

import { StripeService } from "@/payments/stripe/stripe.service";

@Injectable()
export class PaymentsService {
  constructor(private readonly stripeService: StripeService) {}

  @OnEvent(CheckoutEventTypes.INIT_PAYMENT)
  async createPayment(payload: CheckoutPaymentPayload) {
    return this.stripeService.createPayment<CheckoutPaymentPayload["checkoutData"]>(
      payload.cart,
      payload.checkoutData,
    );
  }
}
