import { Type } from "class-transformer";
import { IsDate, IsIn, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

class FindOrdersOrderQuery {
  @IsOptional()
  @IsString()
  @IsIn(["ASC", "DESC"])
  amount?: "ASC" | "DESC";
}

class FindOrdersFilterQuery {
  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  createdAt?: Date;
}

export class FindOrdersRequest {
  @IsOptional()
  @ValidateNested()
  @Type(() => FindOrdersOrderQuery)
  order?: FindOrdersOrderQuery;

  @IsOptional()
  @ValidateNested()
  @Type(() => FindOrdersFilterQuery)
  filter?: FindOrdersFilterQuery;
}
