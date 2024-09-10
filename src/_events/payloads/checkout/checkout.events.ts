import { CheckoutEventTypes } from "@events/events";
import { createEvent } from "@events/events.utils";

export const initPaymentEvent = createEvent(CheckoutEventTypes.INIT_PAYMENT);
export const createOrderEvent = createEvent(CheckoutEventTypes.CREATE_ORDER);
