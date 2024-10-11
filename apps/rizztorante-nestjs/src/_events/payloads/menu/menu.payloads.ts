import type { MenuEventTypes } from "@events/events";

export type MenuPayloads = {
  [MenuEventTypes.GET_SINGLE_POSITION]: GetSinglePositionPayload;
};
export type GetSinglePositionPayload = string;
