import { Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

import { CartItemConfigurableIngredient } from "./cart-item-configurable-ingredient.entity";
import { CartItem } from "./cart-item.entity";

@Entity()
export class CartItemCustomConfig {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToOne(() => CartItem, (cartItem) => cartItem.config)
  cartItem: CartItem;

  @OneToMany(
    () => CartItemConfigurableIngredient,
    (cartItemCustomIngredient) => cartItemCustomIngredient.cartItemCustomConfig,
  )
  configurableIngredient: CartItemConfigurableIngredient[];
}
