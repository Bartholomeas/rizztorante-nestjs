import { BaseImageDto } from "@common/dto/base-image.dto";
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
  public readonly total: number;

  @Expose()
  public readonly items: CartItemRespone[];

  constructor(partial: Partial<GetCartResponse> = {}) {
    Object.assign(this, partial);
  }

  static fromCart(cartDto: CartDto): GetCartResponse {
    return new GetCartResponse({
      id: cartDto.id,
      total: cartDto.total,
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
