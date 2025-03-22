import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

import { BaseMenuDto } from "@/menu/dto/base/base-menu.dto";

export class MenuDto extends BaseMenuDto {
  @ApiProperty({ default: "1221152f-eeb0-419e-8a0b-15769f731ada" })
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  slug: string;

  constructor(partial: Partial<MenuDto>) {
    super();
    Object.assign(this, partial);
  }
}
