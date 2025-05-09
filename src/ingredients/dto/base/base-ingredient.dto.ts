import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export abstract class BaseIngredientDto {
  @ApiProperty({ description: "The name of the ingredient" })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @ApiProperty({ description: "The description of the ingredient" })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: "Is the ingredient available?", default: true })
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean = true;

  @ApiProperty({ description: "Is the ingredient vegan?", default: false })
  @IsBoolean()
  @IsOptional()
  isVegan?: boolean = true;

  @ApiProperty({ description: "Is the ingredient vegetarian?", default: false })
  @IsBoolean()
  @IsOptional()
  isVegetarian?: boolean = false;

  @ApiProperty({ description: "Is the ingredient gluten free?", default: false })
  @IsBoolean()
  @IsOptional()
  isGlutenFree?: boolean = false;
}
