import type { PaymentsEventTypes } from "@events/events";

import type { CheckoutDto } from "@/checkout/dto/checkout.dto";
import type { StripeLineItem } from "@/payments/stripe/interfaces/stripe.interfaces";

export type PaymentsPayloads = {
  [PaymentsEventTypes.INIT_PAYMENT]: InitPaymentPayload;
};

export class InitPaymentPayload {
  public readonly lineItems: StripeLineItem[];
  public readonly checkoutData: CheckoutDto;
}
