import { ApiPropertyOptional } from "@nestjs/swagger";

import { IsEnum, IsInt, IsOptional, Max, Min } from "class-validator";

import { SortOrder } from "@common/types/sort-order.type";

export class PageOptionsDto {
  @ApiPropertyOptional({ enum: SortOrder, default: SortOrder.ASC })
  @IsEnum(SortOrder)
  @IsOptional()
  readonly order?: SortOrder = SortOrder.ASC;

  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
  })
  @IsInt()
  @Min(1)
  readonly page?: number = 1;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: 100,
    default: 24,
  })
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  readonly pageSize?: number = 24;

  get skip(): number {
    return (this.page - 1) * this.pageSize;
  }
}
