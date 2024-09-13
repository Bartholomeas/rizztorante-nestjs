import { ApiProperty } from "@nestjs/swagger";

import { Exclude } from "class-transformer";
import { IsBoolean, IsDate, IsUUID } from "class-validator";

import { BaseOpinionDto } from "./opinion-base.dto";

export class OpinionDto extends BaseOpinionDto {
  @ApiProperty({ default: "123e4567-e89b-12d3-a456-426614174000" })
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsDate()
  createdAt: Date;

  @ApiProperty()
  @IsBoolean()
  @Exclude()
  isApproved: boolean;

  // constructor() {
  //   super();
  //   // Object.assign(this, partial);
  // }
}
