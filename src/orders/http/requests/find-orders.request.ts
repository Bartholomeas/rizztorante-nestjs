import { IsIn, IsOptional, IsString } from "class-validator";

export class FindOrdersRequest {
  @IsOptional()
  @IsString()
  @IsIn(["ASC", "DESC"])
  order?: "ASC" | "DESC";
}
