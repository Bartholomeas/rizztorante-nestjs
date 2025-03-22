import { HOUR_FORMAT_REGEX } from "@common/constants";
import { ApiProperty } from "@nestjs/swagger";
import {
  IsBoolean,
  IsDateString,
  IsOptional,
  IsString,
  Matches,
  ValidateIf,
} from "class-validator";

abstract class BaseSpecialDateDto {
  @ApiProperty({
    description: "Indicates if the restaurant is closed on this special date",
  })
  @IsBoolean()
  isClosed: boolean;

  @ApiProperty({
    default: "YYYY-MM-DD",
  })
  @IsDateString()
  date: string;

  @ApiProperty({
    default: "00:00",
    description: "Opening time in the format HH:MM (00:00 to 23:59)",
  })
  @IsString()
  @ValidateIf((dto) => !dto.isClosed)
  @Matches(HOUR_FORMAT_REGEX, {
    message: "Opening time must be in the format HH:MM (00:00 to 23:59)",
  })
  openingTime: string;

  @ApiProperty({
    default: "00:00",
    description: "Closing time in the format HH:MM (00:00 to 23:59)",
  })
  @IsString()
  @ValidateIf((dto) => !dto.isClosed)
  @Matches(HOUR_FORMAT_REGEX, {
    message: "Closing time must be in the format HH:MM (00:00 to 23:59)",
  })
  closingTime: string;

  @ApiProperty({
    description: "Optional description for the special date",
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}

export class CreateSpecialDateDto extends BaseSpecialDateDto {}
export class UpdateSpecialDateDto extends BaseSpecialDateDto {}
