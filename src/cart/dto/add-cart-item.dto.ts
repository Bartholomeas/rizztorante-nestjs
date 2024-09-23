import { ApiProperty } from "@nestjs/swagger";

import { IsNotEmpty, IsNumber, IsUUID, Min } from "class-validator";

export class AddCartItemDto {
  @ApiProperty({ default: "00000000-0000-0000-0000-000000000000" })
  @IsNotEmpty()
  @IsUUID()
  menuPositionId: string;

  @ApiProperty({ default: 1 })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;

  // TODO: Add things from IngredientsConfiguration

  //   TODO: There will be also a need
  //    to handle category/size/variant
  //    etc (or create separate categories from
  //    different variant products)
}
