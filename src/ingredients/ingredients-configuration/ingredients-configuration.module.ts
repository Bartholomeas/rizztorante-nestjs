import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ConfigurableIngredient } from "./entities/configurable-ingredient.entity";
import { IngredientsConfiguration } from "./entities/ingredients-configuration.entity";
import { IngredientsConfigurationController } from "./ingredients-configuration.controller";
import { IngredientsConfigurationService } from "./ingredients-configuration.service";
import { Ingredient } from "../entities/ingredient.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([IngredientsConfiguration, ConfigurableIngredient, Ingredient]),
  ],
  providers: [IngredientsConfigurationService],
  controllers: [IngredientsConfigurationController],
})
export class IngredientsConfigurationModule {}
