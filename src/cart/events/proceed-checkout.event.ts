import { IsUUID } from "class-validator";

import { EventBody } from "@common/types/events.types";

import { CartEventTypes } from "@/cart/events/cart.events";

export class ProceedCheckoutPayload {
  @IsUUID()
  public readonly userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }
}

export type ProceedCheckoutEvent = EventBody<
  typeof CartEventTypes.PROCEED_CHECKOUT,
  ProceedCheckoutPayload
>;
