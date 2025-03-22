import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

import { IngredientDto } from "@/ingredients/dto/ingredient.dto";

import { BaseConfigurableIngredientDto } from "./base/base-configurable-ingredient.dto";

export class ConfigurableIngredientDto extends BaseConfigurableIngredientDto {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  ingredient: IngredientDto;

  constructor(partial: Partial<ConfigurableIngredientDto>) {
    super();
    Object.assign(this, partial);
  }
}
