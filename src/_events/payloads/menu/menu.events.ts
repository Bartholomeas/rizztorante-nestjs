import { MenuEventTypes } from "@events/events";
import { createEvent } from "@events/events.utils";

export const getSinglePositionEvent = createEvent(MenuEventTypes.GET_SINGLE_POSITION);
