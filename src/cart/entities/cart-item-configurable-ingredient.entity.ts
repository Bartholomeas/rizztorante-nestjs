import { Column, Entity, JoinColumn, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

import { ConfigurableIngredient } from "@/ingredients/ingredients-config/entities/configurable-ingredient.entity";

import { CartItem } from "./cart-item.entity";

@Entity()
export class CartItemConfigurableIngredient {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("int", { default: 1 })
  quantity: number;

  @OneToOne(
    () => ConfigurableIngredient,
    (configurableIngredient) => configurableIngredient.cartItemConfigurableIngredient,
    { eager: true },
  )
  @JoinColumn()
  configurableIngredient: ConfigurableIngredient;

  @ManyToMany(() => CartItem, (cartItem) => cartItem.ingredients)
  cartItem: CartItem;
}
