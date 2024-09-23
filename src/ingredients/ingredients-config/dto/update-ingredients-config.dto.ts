import { ApiProperty } from "@nestjs/swagger";

import { IsOptional, IsString } from "class-validator";

import { BaseIngredientsConfigDto } from "./base/base-ingredients-config.dto";

export class UpdateIngredientsConfigDto extends BaseIngredientsConfigDto {
  @ApiProperty({ description: "Name of the ingredients configuration" })
  @IsString()
  @IsOptional()
  readonly name: string;
}
