import type { IngredientsConfigEventTypes } from "@events/events";

export type IngredientsPayloads = {
  [IngredientsConfigEventTypes.FIND_CONFIGURABLE_INGREDIENT]: FindConfigurableIngredientsPayload;
};

export class FindConfigurableIngredientsPayload {
  public readonly configurableIngredientId: string[];
}
