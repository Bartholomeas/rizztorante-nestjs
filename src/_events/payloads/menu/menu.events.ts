import { MenuPublicEventTypes } from "@events/events";
import { createEvent } from "@events/events.utils";

export const getSinglePositionEvent = createEvent(MenuPublicEventTypes.GET_SINGLE_POSITION);
