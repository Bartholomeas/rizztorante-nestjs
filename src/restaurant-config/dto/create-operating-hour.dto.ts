import { IsBoolean, IsInt, IsString, Matches, Max, Min } from "class-validator";

export class CreateOperatingHourDto {
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek: number;

  @IsBoolean()
  isClosed: boolean;

  @IsString()
  @Matches(/^\d{1,2}:\d{2}$/, {
    message: "Opening time must be in the format HH:MM",
  })
  openingTime: string;

  @IsString()
  @Matches(/^\d{1,2}:\d{2}$/, {
    message: "Closing time must be in the format HH:MM",
  })
  closingTime: string;
}
