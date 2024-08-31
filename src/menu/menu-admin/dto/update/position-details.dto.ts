import { Type } from "class-transformer";
import { IsString, IsNumber, IsOptional, IsArray, ValidateNested } from "class-validator";

import { PositionDto } from "../position.dto";

class NutritionalInfoDto {
  @IsNumber()
  @IsOptional()
  protein?: number;

  @IsNumber()
  @IsOptional()
  carbs?: number;

  @IsNumber()
  @IsOptional()
  fat?: number;

  @IsNumber()
  @IsOptional()
  fiber?: number;
}

export class PositionDetailsDto extends PositionDto {
  @IsString()
  name: string;

  @IsNumber()
  @IsOptional()
  price: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  longDescription?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @IsNumber()
  @IsOptional()
  calories?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  allergens?: string[];

  @ValidateNested()
  @Type(() => NutritionalInfoDto)
  @IsOptional()
  nutritionalInfo?: NutritionalInfoDto;
}
