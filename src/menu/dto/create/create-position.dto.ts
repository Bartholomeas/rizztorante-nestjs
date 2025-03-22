import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

import { BasePositionDto } from "../base/base-position.dto";

export class CreateMenuPositionDto extends BasePositionDto {
  @ApiProperty()
  @IsUUID()
  menuCategoryId: string;
}
