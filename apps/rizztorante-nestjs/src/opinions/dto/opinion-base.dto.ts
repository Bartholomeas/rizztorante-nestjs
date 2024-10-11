import { ApiProperty } from "@nestjs/swagger";

import { Transform } from "class-transformer";
import { IsNumber, IsOptional, IsString, MaxLength } from "class-validator";

import { IsRating } from "./rating-validator";

export abstract class BaseOpinionDto {
  @ApiProperty({ default: 5 })
  @IsNumber({ maxDecimalPlaces: 1 })
  @IsRating()
  @Transform(({ value }) => parseFloat(value))
  rate: number;

  @ApiProperty()
  @IsString()
  @MaxLength(60)
  name: string;

  @ApiProperty({ nullable: true })
  @IsString()
  @IsOptional()
  @MaxLength(600)
  comment: string;
}
