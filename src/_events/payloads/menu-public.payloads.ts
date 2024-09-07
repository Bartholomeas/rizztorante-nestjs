import type { MenuPublicEventTypes } from "@events/events";
import type { EventBody } from "@events/events.types";

export type GetSinglePositionEvent = EventBody<
  typeof MenuPublicEventTypes.GET_SINGLE_POSITION,
  string
>;
