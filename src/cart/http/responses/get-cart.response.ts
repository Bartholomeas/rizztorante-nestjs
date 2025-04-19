import { BaseImageDto } from "@common/dto/base-image.dto";
import { Currency } from "@common/types/currency.type";
import { Exclude, Expose } from "class-transformer";

import { CartDto } from "@/cart/dto/cart.dto";

export class CartItemRespone {
  positionId: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
  amount: number;
  image: BaseImageDto;
  isVegetarian: boolean;
  isGlutenFree: boolean;
  isVegan: boolean;
  customIngredients: unknown[]; // TODO: To handle custom ingredients
  constructor(partial: Partial<CartItemRespone> = {}) {
    Object.assign(this, partial);
  }
}

@Exclude()
export class GetCartResponse {
  @Expose()
  public readonly id: string;

  @Expose()
  public readonly totalAmount: number;

  @Expose()
  public readonly currency: Currency;

  @Expose()
  public readonly items: CartItemRespone[];

  constructor(partial: Partial<GetCartResponse> = {}) {
    Object.assign(this, partial);
  }

  static fromCart(cartDto: CartDto): GetCartResponse {
    return new GetCartResponse({
      id: cartDto.id,
      totalAmount: cartDto.total,
      currency: Currency.PLN,
      items:
        cartDto?.items?.map(
          (p) =>
            new CartItemRespone({
              positionId: p.menuPosition.id,
              name: p.menuPosition.name,
              description: p.menuPosition.description,
              price: p.menuPosition.price,
              quantity: p.quantity,
              amount: p.amount,
              image: p.menuPosition.coreImage,
              isGlutenFree: p.menuPosition.isGlutenFree,
              isVegan: p.menuPosition.isVegan,
              isVegetarian: p.menuPosition.isVegetarian,
              customIngredients: p.ingredients,
            }),
        ) ?? [],
    });
  }
}
