import { Type } from "class-transformer";
import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

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

export class PositionDetailsDto {
  @IsString()
  @IsOptional()
  longDescription?: string;

  // @IsArray()
  // @IsString({ each: true })
  // @IsOptional()
  // images?: string[];

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
