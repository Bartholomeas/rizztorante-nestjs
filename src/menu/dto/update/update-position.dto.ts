import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  MinLength,
} from "class-validator";

export class UpdateMenuPositionDto {
  @ApiProperty({
    description: "The unique identifier of the menu category",
    example: "123e4567-e89b-12d3-a456-426614174000",
    nullable: true,
  })
  @IsUUID()
  @IsOptional()
  menuCategoryId: string;

  @ApiProperty({
    description: "The name of the menu position",
    example: "Veggie Burger",
    minLength: 2,
    nullable: true,
  })
  @IsString()
  @MinLength(2)
  @IsOptional()
  name: string;

  @ApiProperty({
    description: "The price of the menu position",
    example: 10,
    minimum: 0,
    nullable: true,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  price: number;

  @ApiProperty({
    description: "The URL of the menu position image",
    example: "https://example.com/image.jpg",
    nullable: true,
  })
  @IsString()
  image?: string;

  @ApiPropertyOptional({
    description: "Optional description for the menu position",
    nullable: true,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: "List of ingredients used in the menu position",
    type: [String],
    nullable: true,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  ingredients?: string[];

  @ApiProperty({ description: "Indicates if the menu position is vegetarian", nullable: true })
  @IsBoolean()
  @IsOptional()
  isVegetarian: boolean;

  @ApiProperty({ description: "Indicates if the menu position is vegan", nullable: true })
  @IsBoolean()
  @IsOptional()
  isVegan: boolean;

  @ApiProperty({ description: "Indicates if the menu position is gluten-free", nullable: true })
  @IsBoolean()
  @IsOptional()
  isGlutenFree: boolean;
}
