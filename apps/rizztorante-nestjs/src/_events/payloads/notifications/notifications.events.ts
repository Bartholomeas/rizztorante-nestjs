import { NotificationEventTypes } from "@events/events";
import { createEvent } from "@events/events.utils";

export const enableNotificationEvent = createEvent(NotificationEventTypes.ENABLE_PUSH_NOTIFICATION);

export const disableNotificationEvent = createEvent(
  NotificationEventTypes.DISABLE_PUSH_NOTIFICATION,
);
