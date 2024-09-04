import type { Event } from "./events.types";

export enum MenuPublicEventTypes {
  GET_SINGLE_POSITION = "menu-public.get-single-position",
}

export type GetSinglePositionEvent = Event<typeof MenuPublicEventTypes.GET_SINGLE_POSITION, string>;
