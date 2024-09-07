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
    console.log("XDDD", payload);
    // Poczebujem: userId (?), koszyk, dane do platnosci
    return this.stripeService.createPayment<CheckoutPaymentPayload["userCheckoutData"]>(
      payload.cart,
      payload.userCheckoutData,
    );
  }
}
