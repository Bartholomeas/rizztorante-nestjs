import { ApiProperty } from "@nestjs/swagger";

import { IsString } from "class-validator";

export class CheckoutDto {
  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsString()
  lastName2: string;
}
