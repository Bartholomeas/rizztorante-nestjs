import { ApiProperty } from "@nestjs/swagger";

import { IsUUID } from "class-validator";

import { PositionDto } from "../position.dto";

export class UpdateMenuPositionDto extends PositionDto {
  @ApiProperty()
  @IsUUID()
  menuCategoryId: string;
}
