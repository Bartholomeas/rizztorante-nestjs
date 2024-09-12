import { IsBoolean, IsOptional, IsString, Matches } from "class-validator";

import { HOUR_FORMAT_REGEX } from "@common/constants";

abstract class BaseSpecialDateDto {
  @IsBoolean()
  isClosed: boolean;

  @IsString()
  @Matches(HOUR_FORMAT_REGEX, {
    message: "Opening time must be in the format HH:MM (00:00 to 23:59)",
  })
  openingTime: string;

  @IsString()
  @Matches(HOUR_FORMAT_REGEX, {
    message: "Closing time must be in the format HH:MM (00:00 to 23:59)",
  })
  closingTime: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class CreateSpecialDateDto extends BaseSpecialDateDto {}
export class UpdateSpecialDateDto extends BaseSpecialDateDto {}
