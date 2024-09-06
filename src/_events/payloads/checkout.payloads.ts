import { IsUUID } from "class-validator";

import { CheckouEventTypes } from "@events/events";
import { EventBody } from "@events/events.types";

export class CheckoutGetUserCartPayload {
  @IsUUID()
  public readonly userId: string;
  constructor(userId: string) {
    this.userId = userId;
  }
}

export type CheckoutGetUserCartEvent = EventBody<
  typeof CheckouEventTypes.GET_USER_CART,
  CheckoutGetUserCartPayload
>;
