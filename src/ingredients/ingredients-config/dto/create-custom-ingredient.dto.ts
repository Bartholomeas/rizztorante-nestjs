import { ApiProperty } from "@nestjs/swagger";

import { IsInt, IsPositive, IsString, IsUUID } from "class-validator";

export class CreateCustomIngredientDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  priceAdjustment: number;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  quantity: number;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  maxQuantity: number;

  @ApiProperty()
  @IsString()
  @IsUUID()
  ingredientId: string;
}
