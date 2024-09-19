import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Ingredient } from "./entities/ingredient.entity";
import { IngredientsController } from "./ingredients.controller";
import { IngredientsService } from "./ingredients.service";

@Module({
  imports: [TypeOrmModule.forFeature([Ingredient])],
  providers: [IngredientsService],
  controllers: [IngredientsController],
})
export class IngredientsModule {}
