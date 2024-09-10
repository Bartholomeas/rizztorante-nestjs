import { CheckoutEventTypes } from "@events/events";
import { createEvent } from "@events/events.utils";

export const initPaymentEvent = createEvent(CheckoutEventTypes.INIT_PAYMENT);
export const getUserEvent = createEvent(CheckoutEventTypes.GET_USER_PROFILE);
export const createOrderEvent = createEvent(CheckoutEventTypes.CREATE_ORDER);
export const getUserCartEvent = createEvent(CheckoutEventTypes.GET_USER_CART);
