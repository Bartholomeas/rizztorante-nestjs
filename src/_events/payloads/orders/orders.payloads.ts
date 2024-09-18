import type { OrderEventTypes } from "@events/events";

import type { User } from "@/auth/entities/user.entity";
import type { CartDto } from "@/cart/dto/cart.dto";
import type { CheckoutDto } from "@/checkout/dto/checkout.dto";

export type OrdersPayloads = {
  [OrderEventTypes.CREATE_ORDER]: OrdersCreateOrderPayload;
};

export class OrdersCreateOrderPayload {
  public readonly cartDto: CartDto;
  public readonly user: User;
  public readonly checkoutData: CheckoutDto;
}
