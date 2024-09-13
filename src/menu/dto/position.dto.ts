import { ApiProperty } from "@nestjs/swagger";

import { BasePositionDto } from "./base/base-position.dto";
import { MenuPositionImageDto } from "./menu-position-image.dto";

export class PositionDto extends BasePositionDto {
  @ApiProperty({ type: MenuPositionImageDto })
  coreImage: MenuPositionImageDto;
}
