import { ApiProperty } from "@nestjs/swagger";

import { Type } from "class-transformer";
import { IsArray, IsUUID, ValidateNested } from "class-validator";

import { BaseCategoryDto } from "./base/base-category.dto";
import { PositionDto } from "./position.dto";

export class CategoryDto extends BaseCategoryDto {
  @ApiProperty({ description: "The unique identifier for the menu this category belongs to" })
  @IsUUID()
  id: string;

  @ApiProperty({ description: "The positions of the category", type: [PositionDto] })
  @IsArray()
  @ValidateNested()
  @Type(() => PositionDto)
  positions: PositionDto[];
}
