import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";

import { IngredientsConfigEventTypes } from "@events/events";
import { FindConfigurableIngredientsPayload } from "@events/payloads/ingredients";

import { IngredientsConfigService } from "./ingredients-config.service";

@Injectable()
export class IngredientsConfigListener {
  constructor(private readonly ingredientsConfigService: IngredientsConfigService) {}

  @OnEvent(IngredientsConfigEventTypes.FIND_CONFIGURABLE_INGREDIENT)
  findConfigurableIngredients({ configurableIngredientId }: FindConfigurableIngredientsPayload) {
    return this.ingredientsConfigService.findConfigurableIngredients(configurableIngredientId);
  }
}
