import type { OrderEventTypes } from "@events/events";

import type { User } from "@/auth/entities/user.entity";
import type { Cart } from "@/cart/entities/cart.entity";
import type { CheckoutDto } from "@/checkout/dto/checkout.dto";

export type OrdersPayloads = {
  [OrderEventTypes.CREATE_ORDER]: OrdersCreateOrderPayload;
};

export class OrdersCreateOrderPayload {
  public readonly cart: Cart;
  public readonly user: User;
  public readonly checkoutData: CheckoutDto;
}
