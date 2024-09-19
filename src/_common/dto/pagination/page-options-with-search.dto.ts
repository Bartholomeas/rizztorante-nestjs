import { ApiPropertyOptional } from "@nestjs/swagger";

import { IsOptional, IsString } from "class-validator";

import { PageOptionsDto } from "./page-options.dto";

export class PageOptionsWithSearchDto extends PageOptionsDto {
  @ApiPropertyOptional({ description: "The search query" })
  @IsString()
  @IsOptional()
  readonly search?: string;

  constructor(partial: Partial<PageOptionsWithSearchDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
