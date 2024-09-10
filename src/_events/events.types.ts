import type { CartPayloads, CheckoutEventPayloads, UserEventPayloads } from "./payloads";

export interface EventBody<T extends string, P> {
  type: T;
  payload: P;
}

export type EventPayloads = CheckoutEventPayloads & UserEventPayloads & CartPayloads;
