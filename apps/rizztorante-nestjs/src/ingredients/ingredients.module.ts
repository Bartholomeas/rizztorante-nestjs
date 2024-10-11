import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { IngredientsConfigModule } from "@app/restaurant/ingredients/ingredients-config/ingredients-config.module";

import { IngredientImage } from "./entities/ingredient-image.entity";
import { Ingredient } from "./entities/ingredient.entity";
import { IngredientsController } from "./ingredients.controller";
import { IngredientsService } from "./ingredients.service";

@Module({
  imports: [TypeOrmModule.forFeature([Ingredient, IngredientImage]), IngredientsConfigModule],
  providers: [IngredientsService],
  controllers: [IngredientsController],
})
export class IngredientsModule {}
