import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { IngredientImage } from "./entities/ingredient-image.entity";
import { Ingredient } from "./entities/ingredient.entity";
import { IngredientsConfigurationModule } from "./ingredients-configuration/ingredients-configuration.module";
import { IngredientsController } from "./ingredients.controller";
import { IngredientsService } from "./ingredients.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Ingredient, IngredientImage]),
    IngredientsConfigurationModule,
  ],
  providers: [IngredientsService],
  controllers: [IngredientsController],
})
export class IngredientsModule {}
