import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

import { IsInt, IsOptional, IsString, Min, MinLength, IsArray, IsBoolean } from "class-validator";

export class PositionDto {
  @ApiProperty()
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty()
  @IsInt()
  @Min(0)
  price: number;

  @ApiPropertyOptional({ description: "Optional description for the position", nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ type: [String], nullable: true })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  ingredients?: string[];

  @ApiProperty()
  @IsBoolean()
  isVegetarian: boolean;

  @ApiProperty()
  @IsBoolean()
  isVegan: boolean;

  @ApiProperty()
  @IsBoolean()
  isGlutenFree: boolean;
}
