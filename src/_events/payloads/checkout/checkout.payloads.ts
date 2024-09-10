import type { CheckoutEventTypes } from "@events/events";

import type { Cart } from "@/cart/entities/cart.entity";
import type { CheckoutDto } from "@/checkout/dto/checkout.dto";

export interface CheckoutEventPayloads {
  [CheckoutEventTypes.INIT_PAYMENT]: CheckoutPaymentPayload;
}

export class CheckoutPaymentPayload {
  public readonly cart: Cart;
  public readonly checkoutData: CheckoutDto;
}
