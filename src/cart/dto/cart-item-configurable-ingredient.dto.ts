import { ApiProperty } from "@nestjs/swagger";

import { IsInt, IsPositive, IsUUID, Min } from "class-validator";

export class CartItemConfigurableIngredientDto {
  @ApiProperty({ default: "00000000-0000-0000-0000-000000000000" })
  @IsUUID()
  id: string;

  @ApiProperty({ default: 1 })
  @IsInt()
  @IsPositive()
  @Min(1)
  quantity: number;
}
