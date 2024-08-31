import { ApiProperty } from "@nestjs/swagger";

import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class MenuDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsNotEmpty()
  description?: string;
}
