import type { OrdersPayloads } from "@events/payloads/orders/orders.payloads";

import type {
  CartPayloads,
  CheckoutEventPayloads,
  MenuPayloads,
  UserEventPayloads,
} from "./payloads";

export interface EventBody<T extends string, P> {
  type: T;
  payload: P;
}

export type EventPayloads = CheckoutEventPayloads &
  UserEventPayloads &
  CartPayloads &
  MenuPayloads &
  OrdersPayloads;
