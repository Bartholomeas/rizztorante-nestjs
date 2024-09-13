import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

import { IsArray, IsBoolean, IsInt, IsOptional, IsString, Min, MinLength } from "class-validator";

export abstract class BasePositionDto {
  @ApiProperty({ description: "The name of the position" })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ description: "The price of the position" })
  @IsInt()
  @Min(0)
  price: number;

  @ApiPropertyOptional({ description: "Optional description for the position", nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    type: [String],
    nullable: true,
    description: "The ingredients of the position",
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  ingredients?: string[];

  @ApiProperty({ description: "Whether the position is vegetarian" })
  @IsBoolean()
  isVegetarian: boolean;

  @ApiProperty({ description: "Whether the position is vegan" })
  @IsBoolean()
  isVegan: boolean;

  @ApiProperty({ description: "Whether the position is gluten free" })
  @IsBoolean()
  isGlutenFree: boolean;
}
