import type { CheckoutEventTypes } from "@events/events";

import type { User } from "@/auth/entities/user.entity";
import type { Cart } from "@/cart/entities/cart.entity";
import type { CheckoutDto } from "@/checkout/dto/checkout.dto";

export interface CheckoutEventPayloads {
  [CheckoutEventTypes.INIT_PAYMENT]: CheckoutPaymentPayload;
  [CheckoutEventTypes.GET_USER_PROFILE]: CheckoutGetUserProfilePayload;
  [CheckoutEventTypes.CREATE_ORDER]: CheckoutCreateOrderPayload;
  [CheckoutEventTypes.GET_USER_CART]: CheckoutGetUserCartPayload;
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

export type CheckoutGetUserProfilePayload = string;
export type CheckoutGetUserCartPayload = string;
