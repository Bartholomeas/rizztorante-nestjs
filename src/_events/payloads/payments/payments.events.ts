import { PaymentsEventTypes } from "@events/events";
import { createEvent } from "@events/events.utils";

export const initPaymentEvent = createEvent(PaymentsEventTypes.INIT_PAYMENT);
