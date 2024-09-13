import { ApiProperty } from "@nestjs/swagger";

import { IsString, IsNumber, ValidateNested, IsUUID, IsPositive, Min } from "class-validator";

import { MenuPositionImageDto } from "@/menu/dto/menu-position-image.dto";
import { MenuPositionDto } from "@/menu/dto/menuPositionDto";

import { CartItem } from "../entities/cart-item.entity";

export class CartItemDto {
  @ApiProperty({
    format: "uuid",
    description: "The id of the menu position",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsString()
  @IsUUID()
  id: string;

  @ApiProperty({
    description: "The quantity of the menu position",
    example: 1,
  })
  @IsNumber()
  @IsPositive()
  quantity: number;

  @ApiProperty({
    description: "The amount of the menu position",
    example: 1000,
  })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ type: MenuPositionImageDto })
  @ValidateNested()
  menuPosition: MenuPositionDto;

  constructor(partial: Partial<CartItem>) {
    Object.assign(this, partial);
  }
}
