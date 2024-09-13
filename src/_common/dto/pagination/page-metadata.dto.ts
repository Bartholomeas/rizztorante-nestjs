import { ApiProperty } from "@nestjs/swagger";

import { IsBoolean, IsNumber, IsPositive } from "class-validator";

import { PageMetadataParams } from "@common/types/page-metadata-params.type";

export class PageMetadataDto {
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  readonly page: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  readonly pageSize: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  readonly totalItems: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  readonly totalPages: number;

  @ApiProperty()
  @IsBoolean()
  readonly hasPreviousPage: boolean;

  @ApiProperty()
  @IsBoolean()
  readonly hasNextPage: boolean;

  constructor({ pageOptionsDto, totalItems }: PageMetadataParams) {
    this.page = pageOptionsDto.page;
    this.pageSize = pageOptionsDto.pageSize;

    this.totalItems = totalItems;
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.totalPages;
  }
}
