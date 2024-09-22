import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { CartItemConfigurableIngredient } from "./cart-item-custom-ingredient.entity";
import { CartItem } from "./cart-item.entity";

@Entity()
export class CartItemCustomConfig {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => CartItem, (cartItem) => cartItem.config)
  cartItem: CartItem;

  @OneToMany(
    () => CartItemConfigurableIngredient,
    (cartItemCustomIngredient) => cartItemCustomIngredient.cartItemCustomConfig,
  )
  customIngredient: CartItemConfigurableIngredient[];
}
