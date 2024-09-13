import { ApiProperty } from "@nestjs/swagger";

import { IsUUID } from "class-validator";

import { BasePositionDetailsDto } from "./base/base-position-details.dto";
import { PositionDto } from "./position.dto";

export class PositionDetailsDto extends BasePositionDetailsDto {
  @ApiProperty({
    description: "The id of the menu position",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    type: PositionDto,
  })
  menuPosition: PositionDto;
}
