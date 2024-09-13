import { ApiProperty } from "@nestjs/swagger";

import { IsNumber, IsOptional, IsString, MaxLength } from "class-validator";

import { IsRating } from "./rating-validator";

export class CreateOpinionDto {
  @ApiProperty({ default: 5 })
  @IsNumber({ maxDecimalPlaces: 1 })
  @IsRating()
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
