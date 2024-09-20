import { ApiProperty } from "@nestjs/swagger";

export class CreateConfigurableIngredientDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  priceAdjustment: number;

  @ApiProperty()
  quantity: number;
}
