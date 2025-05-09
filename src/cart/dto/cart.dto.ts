import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsUUID, Min } from "class-validator";

import { StripeLineItem } from "@/payments/stripe/interfaces/stripe.interfaces";

import { Cart } from "../entities/cart.entity";

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

export class FlatCartItemDto {
  id: string;
  quantity: number;
  amount: number;
  menuPosition: {
    id: string;
    name: string;
    price: number;
    description: string;
    isVegetarian: boolean;
    isVegan: boolean;
    isGlutenFree: boolean;
    coreImage: {
      id: string;
      url: string;
      alt: string;
      caption: string | null;
    };
  };
  ingredients: {
    id: string;
    quantity: number;
    configurableIngredientId: string;
    priceAdjustment: number;
    maxQuantity: number;
    name: string;
    description: string;
    isAvailable: boolean;
  }[];

  constructor(cartItem: CartItemDto) {
    if (!cartItem || !cartItem.menuPosition) {
      console.error("Invalid cart item:", cartItem);
      return null;
    }

    this.id = cartItem.id;
    this.quantity = cartItem.quantity;
    this.amount = cartItem.amount;
    this.menuPosition = {
      id: cartItem.menuPosition.id,
      name: cartItem.menuPosition.name,
      price: cartItem.menuPosition.price,
      description: cartItem.menuPosition.description,
      isVegetarian: cartItem.menuPosition.isVegetarian,
      isVegan: cartItem.menuPosition.isVegan,
      isGlutenFree: cartItem.menuPosition.isGlutenFree,
      coreImage: cartItem.menuPosition.coreImage
        ? {
            id: cartItem.menuPosition.coreImage.id,
            url: cartItem.menuPosition.coreImage.url,
            alt: cartItem.menuPosition.coreImage.alt,
            caption: cartItem.menuPosition.coreImage.caption,
          }
        : null,
    };

    this.ingredients =
      cartItem.ingredients
        ?.map((ingredient) => ({
          id: ingredient.id,
          configurableIngredientId: ingredient.configurableIngredient?.ingredient?.id,
          name: ingredient.configurableIngredient?.ingredient?.name,
          description: ingredient.configurableIngredient?.ingredient?.description,
          quantity: ingredient.quantity,
          maxQuantity: ingredient.configurableIngredient?.maxQuantity,
          priceAdjustment: ingredient.configurableIngredient?.priceAdjustment,
          totalAmount:
            ingredient.quantity * (ingredient.configurableIngredient?.priceAdjustment || 0),
          isAvailable: ingredient.configurableIngredient?.ingredient?.isAvailable,
        }))
        .filter(Boolean) ?? [];
  }
}

export class FlatCartDto {
  id: string;
  total: number;
  items: FlatCartItemDto[];
}
