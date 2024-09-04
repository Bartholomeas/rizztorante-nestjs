import { ApiProperty } from "@nestjs/swagger";

import { IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator";

export class ChangeCartItemQuantityDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  cartItemId: string;

  @ApiProperty({ default: 1 })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}
