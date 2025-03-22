import { PaymentsEventTypes } from "@events/events";
import { InitPaymentPayload } from "@events/payloads";
import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";

import { StripeService } from "@/payments/stripe/stripe.service";

@Injectable()
export class PaymentsService {
  constructor(private readonly stripeService: StripeService) {}

  @OnEvent(PaymentsEventTypes.INIT_PAYMENT)
  async createPayment(payload: InitPaymentPayload) {
    return this.stripeService.createPayment<InitPaymentPayload["checkoutData"]>({
      orderId: payload.orderId,
      additionalInfo: payload.checkoutData,
      lineItems: payload.lineItems,
    });
  }
}
