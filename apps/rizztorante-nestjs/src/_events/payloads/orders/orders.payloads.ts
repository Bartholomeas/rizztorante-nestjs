import type { OrderEventTypes } from "@events/events";

import type { CartDto } from "@app/restaurant/cart/dto/cart.dto";
import type { CheckoutDto } from "@app/restaurant/checkout/dto/checkout.dto";
import type { User } from "@app/restaurant/users/entities/user.entity";

export type OrdersPayloads = {
  [OrderEventTypes.CREATE_ORDER]: OrdersCreateOrderPayload;
};

export class OrdersCreateOrderPayload {
  public readonly cartDto: CartDto;
  public readonly user: User;
  public readonly checkoutData: CheckoutDto;
}
