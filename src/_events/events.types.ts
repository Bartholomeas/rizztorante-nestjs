import type { CheckoutEventPayloads } from "./payloads";

export interface EventBody<T extends string, P> {
  type: T;
  payload: P;
}

export type EventPayloads = CheckoutEventPayloads;
