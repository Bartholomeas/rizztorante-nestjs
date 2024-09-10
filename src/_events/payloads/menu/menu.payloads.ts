import type { MenuPublicEventTypes } from "@events/events";

export type MenuPayloads = {
  [MenuPublicEventTypes.GET_SINGLE_POSITION]: GetSinglePositionPayload;
};
export type GetSinglePositionPayload = string;
