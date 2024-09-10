import type { CheckoutEventTypes } from "@events/events";

import type { User } from "@/auth/entities/user.entity";
import type { Cart } from "@/cart/entities/cart.entity";
import type { CheckoutDto } from "@/checkout/dto/checkout.dto";

export interface CheckoutEventPayloads {
  [CheckoutEventTypes.INIT_PAYMENT]: CheckoutPaymentPayload;
  [CheckoutEventTypes.CREATE_ORDER]: CheckoutCreateOrderPayload;
}

export class CheckoutPaymentPayload {
  public readonly cart: Cart;
  public readonly checkoutData: CheckoutDto;
}

export class CheckoutCreateOrderPayload {
  public readonly cart: Cart;
  public readonly user: User;
  public readonly checkoutData: CheckoutDto;
}
