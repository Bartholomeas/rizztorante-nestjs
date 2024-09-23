import { ApiProperty } from "@nestjs/swagger";

import { IsInt, IsPositive } from "class-validator";

export class CreateConfigurableIngredientDto {
  @ApiProperty()
  @IsInt()
  @IsPositive()
  priceAdjustment: number;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  maxQuantity: number;
}
