import { ApiProperty } from "@nestjs/swagger";

import { IsNumber, IsUUID, Min } from "class-validator";

import { StripeLineItem } from "@/payments/stripe/interfaces/stripe.interfaces";

import { CartItemDto } from "./cart-item.dto";
import { Cart } from "../entities/cart.entity";

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

  public toStripeLineItems(): StripeLineItem[] {
    return this?.items?.map(
      (item): StripeLineItem => ({
        price_data: {
          currency: "pln",
          unit_amount: item.menuPosition.price,
          product_data: {
            name: item.menuPosition.name,
            images: item?.menuPosition?.coreImage?.url ? [item.menuPosition.coreImage.url] : [],
            description: item.menuPosition.description,
          },
        },
        quantity: item.quantity,
      }),
    );
  }

  constructor(partial: Partial<Cart>) {
    Object.assign(this, partial);
  }
}
