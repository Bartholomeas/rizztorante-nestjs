import type { CheckoutEventTypes } from "@events/events";
import type { EventBody } from "@events/events.types";

import type { User } from "@/auth/entities/user.entity";
import type { Cart } from "@/cart/entities/cart.entity";
import type { CheckoutDto } from "@/checkout/dto/checkout.dto";

export class CheckoutPaymentPayload {
  public readonly cart: Cart;
  public readonly checkoutData: CheckoutDto;
}

export class CheckoutCreateOrderPayload {
  public readonly cart: Cart;
  public readonly user: User;
  public readonly checkoutData: CheckoutDto;
}

export type CheckoutPaymentEvent = EventBody<
  typeof CheckoutEventTypes.INIT_PAYMENT,
  CheckoutPaymentPayload
>;
export type CheckoutCreateOrderEvent = EventBody<
  typeof CheckoutEventTypes.CREATE_ORDER,
  CheckoutCreateOrderPayload
>;
export type CheckoutGetUserEvent = EventBody<typeof CheckoutEventTypes.GET_USER_PROFILE, string>;
