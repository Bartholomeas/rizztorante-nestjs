import { ApiProperty } from "@nestjs/swagger";

import { IsNotEmpty, IsString, MinLength } from "class-validator";

export abstract class BaseMenuDto {
  @ApiProperty({ description: "The name of the menu item", example: "Veggie Burger" })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @ApiProperty({
    description: "A brief description of the menu item",
    required: false,
    example: "A flavorful veggie burger with avocado",
  })
  @IsString()
  @IsNotEmpty()
  description?: string;
}
