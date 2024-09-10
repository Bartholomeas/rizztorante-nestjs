import { IsUUID } from "class-validator";

import { CartEventTypes } from "@events/events";

export type CartPayloads = {
  [CartEventTypes.GET_USER_CART]: GetUserCartPayload;
};
export type GetUserCartPayload = string;

export class ProceedCheckoutPayload {
  @IsUUID()
  public readonly userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }
}

// export type ProceedCheckoutEvent = EventBody<
//   typeof CartEventTypes.PROCEED_CHECKOUT,
//   ProceedCheckoutPayload
// >;
