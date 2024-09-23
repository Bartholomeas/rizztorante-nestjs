import { ApiProperty } from "@nestjs/swagger";

import { IsArray, IsString, IsUUID } from "class-validator";

export class ConfigurationWithIdsDto {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsArray()
  @IsUUID("all", { each: true })
  configurableIngredients?: { id: string }[];

  @ApiProperty()
  @IsArray()
  @IsUUID("all", { each: true })
  menuPositions?: { id: string }[];
}
