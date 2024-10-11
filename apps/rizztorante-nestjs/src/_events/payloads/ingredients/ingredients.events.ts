import { IngredientsConfigEventTypes } from "@events/events";
import { createEvent } from "@events/events.utils";

export const findConfigurableIngredientsEvent = createEvent(
  IngredientsConfigEventTypes.FIND_CONFIGURABLE_INGREDIENT,
);
