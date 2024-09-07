import { IsString } from "class-validator";

import type { CheckoutEventTypes } from "@events/events";
import type { EventBody } from "@events/events.types";

import type { Cart } from "@/cart/entities/cart.entity";
import type { CheckoutDto } from "@/checkout/dto/checkout.dto";

export class CheckoutPaymentPayload {
  public readonly userCheckoutData: CheckoutDto;
  public readonly cart: Cart;
  constructor(userCheckoutData: CheckoutDto, cart: Cart) {
    this.userCheckoutData = userCheckoutData;
    this.cart = cart;
  }
}

export class CheckoutCreateOrderPayload {
  @IsString()
  public readonly orderId: string;
}

export type CheckoutGetUserCartEvent = EventBody<typeof CheckoutEventTypes.GET_USER_CART, string>;

export type CheckoutPaymentEvent = EventBody<
  typeof CheckoutEventTypes.INIT_PAYMENT,
  CheckoutPaymentPayload
>;

export type CheckoutCreateOrderEvent = EventBody<
  typeof CheckoutEventTypes.CREATE_ORDER,
  CheckoutCreateOrderPayload
>;
