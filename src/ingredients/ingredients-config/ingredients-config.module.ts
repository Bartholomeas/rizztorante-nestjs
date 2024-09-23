import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ConfigurableIngredient } from "./entities/configurable-ingredient.entity";
import { IngredientsConfig } from "./entities/ingredients-config.entity";
import { IngredientsConfigController } from "./ingredients-config.controller";
import { IngredientsConfigListener } from "./ingredients-config.listener";
import { IngredientsConfigService } from "./ingredients-config.service";
import { Ingredient } from "../entities/ingredient.entity";

@Module({
  imports: [TypeOrmModule.forFeature([IngredientsConfig, ConfigurableIngredient, Ingredient])],
  providers: [IngredientsConfigService, IngredientsConfigListener],
  controllers: [IngredientsConfigController],
})
export class IngredientsConfigModule {}
