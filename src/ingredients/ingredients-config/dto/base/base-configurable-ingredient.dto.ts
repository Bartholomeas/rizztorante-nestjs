import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNumber } from "class-validator";

export abstract class BaseConfigurableIngredientDto {
  @ApiProperty()
  @IsNumber()
  @IsInt()
  priceAdjustment: number = 0;

  @ApiProperty()
  maxQuantity: number;
}
