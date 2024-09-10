import type { CartEventTypes } from "@events/events";

export type CartPayloads = {
  [CartEventTypes.GET_USER_CART]: GetUserCartPayload;
};
export type GetUserCartPayload = string;
