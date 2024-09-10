import type { OrdersPayloads } from "@events/payloads/orders/orders.payloads";

import type { CartPayloads, MenuPayloads, PaymentsPayloads, UserEventPayloads } from "./payloads";

export interface EventBody<T extends string, P> {
  type: T;
  payload: P;
}

export type EventPayloads = UserEventPayloads &
  CartPayloads &
  MenuPayloads &
  OrdersPayloads &
  PaymentsPayloads;
