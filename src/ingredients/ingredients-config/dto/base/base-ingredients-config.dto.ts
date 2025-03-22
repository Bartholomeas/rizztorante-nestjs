import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsOptional, IsString, IsUUID } from "class-validator";

export abstract class BaseIngredientsConfigDto {
  @ApiProperty({ description: "Name of the ingredients configuration" })
  @IsString()
  name: string;

  @ApiProperty({ description: "Menu position ids", default: [] })
  @IsOptional()
  @IsArray()
  @IsUUID("all", { each: true })
  menuPositionIds: string[] = [];

  @ApiProperty({ description: "Ingredient ids", default: [] })
  @IsOptional()
  @IsArray()
  @IsUUID("all", { each: true })
  configurableIngredientIds?: string[] = [];
}
