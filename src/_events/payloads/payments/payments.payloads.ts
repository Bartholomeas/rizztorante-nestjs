import type { PaymentsEventTypes } from "@events/events";

import type { Cart } from "@/cart/entities/cart.entity";
import type { CheckoutDto } from "@/checkout/dto/checkout.dto";

export type PaymentsPayloads = {
  [PaymentsEventTypes.INIT_PAYMENT]: InitPaymentPayload;
};

export class InitPaymentPayload {
  public readonly cart: Cart;
  public readonly checkoutData: CheckoutDto;
}
