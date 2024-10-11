import { UserEventTypes } from "@events/events";
import { createEvent } from "@events/events.utils";

export const getUserEvent = createEvent(UserEventTypes.GET_USER_PROFILE);
