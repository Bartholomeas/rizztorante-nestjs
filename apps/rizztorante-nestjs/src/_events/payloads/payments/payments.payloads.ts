import type { PaymentsEventTypes } from "@events/events";

import type { CheckoutDto } from "@app/restaurant/checkout/dto/checkout.dto";
import type { StripeLineItem } from "@app/restaurant/payments/stripe/interfaces/stripe.interfaces";

export type PaymentsPayloads = {
  [PaymentsEventTypes.INIT_PAYMENT]: InitPaymentPayload;
};

export class InitPaymentPayload {
  public readonly lineItems: StripeLineItem[];
  public readonly checkoutData: CheckoutDto;
}
