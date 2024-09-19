import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ConfigurableIngredient } from "./entities/configurable-ingredient.entity";
import { IngredientImage } from "./entities/ingredient-image.entity";
import { Ingredient } from "./entities/ingredient.entity";
import { IngredientsConfiguration } from "./entities/ingredients-configuration.entity";
import { IngredientsController } from "./ingredients.controller";
import { IngredientsService } from "./ingredients.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Ingredient,
      IngredientsConfiguration,
      ConfigurableIngredient,
      IngredientImage,
    ]),
  ],
  providers: [IngredientsService],
  controllers: [IngredientsController],
})
export class IngredientsModule {}
