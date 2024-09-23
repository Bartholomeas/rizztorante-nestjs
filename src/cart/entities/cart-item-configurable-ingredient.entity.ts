import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { ConfigurableIngredient } from "@/ingredients/ingredients-config/entities/configurable-ingredient.entity";

import { CartItemCustomConfig } from "./cart-item-custom-config.entity";

@Entity()
export class CartItemConfigurableIngredient {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("int", { default: 1 })
  quantity: number;

  @ManyToMany(
    () => ConfigurableIngredient,
    (configurableIngredient) => configurableIngredient.cartItemConfigurableIngredient,
  )
  configurableIngredient: ConfigurableIngredient[];

  @ManyToOne(
    () => CartItemCustomConfig,
    (cartItemCustomConfig) => cartItemCustomConfig.configurableIngredient,
  )
  cartItemCustomConfig: CartItemCustomConfig;
}
