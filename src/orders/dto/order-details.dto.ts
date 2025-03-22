import { BaseImageDto } from "@common/dto/base-image.dto";

import { CartDto } from "@/cart/dto/cart.dto";

export class OrderDetailsItem {
  id: string;
  positionId: string;
  name: string;
  quantity: number;
  price: number;
  amount: number;
  image: BaseImageDto;
  isVegetarian: boolean;
  isGlutenFree: boolean;
  isVegan: boolean;
  customIngredients: unknown[]; // TODO: To handle custom ingredients
  constructor(partial: Partial<OrderDetailsItem> = {}) {
    Object.assign(this, partial);
  }
}

export class OrderDetailsEntry {
  items: OrderDetailsItem[];

  constructor(partial: Partial<OrderDetailsEntry> = {}) {
    Object.assign(this, partial);
  }

  static fromCart(cartDto: CartDto): OrderDetailsEntry {
    return new OrderDetailsEntry({
      items:
        cartDto?.items?.map(
          (p) =>
            new OrderDetailsItem({
              id: p.id,
              positionId: p.menuPosition.id,
              name: p.menuPosition.name,
              amount: p.amount,
              image: p.menuPosition.coreImage,
              price: p.menuPosition.price,
              quantity: p.quantity,
              isGlutenFree: p.menuPosition.isGlutenFree,
              isVegan: p.menuPosition.isVegan,
              isVegetarian: p.menuPosition.isVegetarian,
              customIngredients: p.ingredients,
            }),
        ) ?? [],
    });
  }
}
