import { IsUUID } from "class-validator";

import { CartEventTypes } from "@events/events";
import { EventBody } from "@events/events.types";

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
