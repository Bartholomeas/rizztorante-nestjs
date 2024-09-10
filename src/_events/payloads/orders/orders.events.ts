import { OrderEventTypes } from "@events/events";
import { createEvent } from "@events/events.utils";

export const createOrderEvent = createEvent(OrderEventTypes.CREATE_ORDER);
