import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CustomIngredient } from "./entities/custom-ingredient.entity";
import { IngredientsConfig } from "./entities/ingredients-config.entity";
import { IngredientsConfigController } from "./ingredients-config.controller";
import { IngredientsConfigService } from "./ingredients-config.service";
import { Ingredient } from "../entities/ingredient.entity";

@Module({
  imports: [TypeOrmModule.forFeature([IngredientsConfig, CustomIngredient, Ingredient])],
  providers: [IngredientsConfigService],
  controllers: [IngredientsConfigController],
})
export class IngredientsConfigModule {}
