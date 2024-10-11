import type { ConfigurableIngredient } from "@app/restaurant/ingredients/ingredients-config/entities/configurable-ingredient.entity";
export class CartItemConfigurableIngredientDto {
  id: string;
  quantity: number;
  configurableIngredient: ConfigurableIngredient;
}
