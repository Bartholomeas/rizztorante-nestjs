import { HOUR_FORMAT_REGEX } from "@common/constants";
import { ApiProperty } from "@nestjs/swagger";
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
  ValidateIf,
} from "class-validator";

abstract class BaseOperatingHourDto {
  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek: number;

  @ApiProperty({ default: false })
  @IsBoolean()
  @IsOptional()
  isClosed: boolean;

  @ApiProperty({ default: false })
  @IsBoolean()
  @IsOptional()
  isFullDay: boolean;

  @ApiProperty({
    default: "00:00",
  })
  @IsString()
  @ValidateIf((dto) => !dto.isClosed)
  @Matches(HOUR_FORMAT_REGEX, {
    message: "Opening time must be in the format HH:MM (00:00 to 23:59)",
  })
  openingTime: string;

  @ApiProperty({
    default: "00:00",
  })
  @IsString()
  @ValidateIf((dto) => !dto.isClosed)
  @Matches(HOUR_FORMAT_REGEX, {
    message: "Closing time must be in the format HH:MM (00:00 to 23:59)",
  })
  closingTime: string;
}

export class CreateOperatingHourDto extends BaseOperatingHourDto {}
export class UpdateOperatingHourDto extends BaseOperatingHourDto {}
