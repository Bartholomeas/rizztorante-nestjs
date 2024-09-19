import { ApiProperty } from "@nestjs/swagger";

import { IsArray, IsOptional, IsString, IsUUID } from "class-validator";

export abstract class BaseIngredientsConfigurationDto {
  @ApiProperty({ description: "Name of the ingredients configuration" })
  @IsString()
  readonly name: string;

  @ApiProperty({ description: "Menu position ids", default: [] })
  @IsOptional()
  @IsArray()
  @IsUUID("all", { each: true })
  readonly menuPositionIds: string[] = [];

  @ApiProperty({ description: "Ingredient ids", default: [] })
  @IsOptional()
  @IsArray()
  @IsUUID("all", { each: true })
  readonly ingredientIds: string[] = [];
}
