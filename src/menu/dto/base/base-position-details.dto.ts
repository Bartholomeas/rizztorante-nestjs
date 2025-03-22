import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

class NutritionalInfoDto {
  @ApiProperty({
    description: "The amount of protein in grams",
    example: 20,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  protein?: number;

  @ApiProperty({
    description: "The amount of carbohydrates in grams",
    example: 30,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  carbs?: number;

  @ApiProperty({
    description: "The amount of fat in grams",
    example: 10,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  fat?: number;

  @ApiProperty({
    description: "The amount of fiber in grams",
    example: 5,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  fiber?: number;
}

export abstract class BasePositionDetailsDto {
  @ApiProperty({
    description: "The short description of the menu position",
    example: "Delicious and nutritious",
    required: false,
  })
  @IsString()
  @IsOptional()
  longDescription?: string;

  @ApiProperty({
    description: "The number of calories in the menu position",
    example: 200,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  calories?: number;

  @ApiProperty({
    description: "List of allergens present in the menu position",
    example: ["gluten", "nuts"],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  allergens?: string[];

  @ApiProperty({
    description: "Nutritional information of the menu position",
    required: false,
  })
  @ValidateNested()
  @Type(() => NutritionalInfoDto)
  @IsOptional()
  nutritionalInfo?: NutritionalInfoDto;
}
