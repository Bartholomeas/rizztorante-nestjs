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
  @ApiProperty()
  @IsUUID()
  @IsOptional()
  menuCategoryId: string;

  @ApiProperty()
  @IsString()
  @MinLength(2)
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsInt()
  @Min(0)
  @IsOptional()
  price: number;

  @ApiProperty({ default: "string" })
  @IsString()
  image?: string;

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
  @IsOptional()
  isVegetarian: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isVegan: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isGlutenFree: boolean;
}
