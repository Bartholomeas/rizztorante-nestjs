import { PageMetadataParams } from "@common/types/page-metadata-params.type";
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsPositive } from "class-validator";

export class PageMetadataDto {
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  readonly page: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  readonly take: number;

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
    this.take = pageOptionsDto.take;

    this.totalItems = totalItems;
    this.totalPages = Math.ceil(this.totalItems / this.take);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.totalPages;
  }
}
