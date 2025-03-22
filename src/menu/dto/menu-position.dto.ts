import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUUID } from "class-validator";

import { BasePositionDto } from "./base/base-position.dto";
import { MenuPositionImageDto } from "./menu-position-image.dto";

export class MenuPositionDto extends BasePositionDto {
  @ApiProperty({
    format: "uuid",
    description: "The id of the menu position",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsString()
  @IsUUID()
  id: string;

  @ApiProperty({ type: MenuPositionImageDto })
  coreImage: MenuPositionImageDto;

  @ApiProperty({ type: [String] })
  ingredients: any[];
}
