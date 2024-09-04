import { ApiProperty } from "@nestjs/swagger";

import { IsNotEmpty, IsNumber } from "class-validator";

export class ChangeCartItemQuantityDto {
  // @ApiProperty({ default: "00000000-0000-0000-0000-000000000000" })
  // @IsNotEmpty()
  // @IsString()
  // @IsUUID()
  // cartItemId: string;

  @ApiProperty({ default: 1 })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}
