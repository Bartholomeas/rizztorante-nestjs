import { ApiProperty } from "@nestjs/swagger";

import { IsNumber, IsUUID, Min } from "class-validator";

import { CartItemDto } from "./cart-item.dto";

export class CartDto {
  @ApiProperty({
    description: "The id of the menu position",
    example: "123e4567-e89b-12d3-a456-426614174000",
    format: "uuid",
  })
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  total: number;

  @ApiProperty({ type: [CartItemDto] })
  items: CartItemDto[];
}
