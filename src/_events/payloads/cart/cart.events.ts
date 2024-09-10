import { CartEventTypes } from "@events/events";
import { createEvent } from "@events/events.utils";

export const getUserCartEvent = createEvent(CartEventTypes.GET_USER_CART);
