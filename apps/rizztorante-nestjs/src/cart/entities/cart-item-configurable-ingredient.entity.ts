import { ConfigurableIngredient } from "@app/restaurant/ingredients/ingredients-config/entities/configurable-ingredient.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { CartItem } from "./cart-item.entity";

@Entity()
export class CartItemConfigurableIngredient {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("int", { default: 1 })
  quantity: number;

  @ManyToOne(
    () => ConfigurableIngredient,
    (configurableIngredient) => configurableIngredient.cartItemConfigurableIngredient,
  )
  @JoinColumn()
  configurableIngredient: ConfigurableIngredient;

  @ManyToMany(() => CartItem, (cartItem) => cartItem.ingredients)
  cartItem: CartItem;
}
