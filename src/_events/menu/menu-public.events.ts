import type { EventBody } from "@/_common/types/events.types";

export enum MenuPublicEventTypes {
  GET_SINGLE_POSITION = "menu-public.get-single-position",
}

export type GetSinglePositionEvent = EventBody<
  typeof MenuPublicEventTypes.GET_SINGLE_POSITION,
  string
>;
