import { ApiProperty } from "@nestjs/swagger";

import { IsArray } from "class-validator";

import { PageMetadataDto } from "./page-metadata.dto";

export class PageDto<T> {
  @ApiProperty()
  @IsArray()
  readonly data: T[];

  @ApiProperty({ type: () => PageMetadataDto })
  readonly meta: PageMetadataDto;
}
