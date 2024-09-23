import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { CartItemConfigurableIngredient } from "@/cart/entities/cart-item-custom-ingredient.entity";

import { IngredientsConfig } from "./ingredients-config.entity";
import { Ingredient } from "../../entities/ingredient.entity";

@Entity()
export class ConfigurableIngredient {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("int", { default: 0 })
  priceAdjustment: number;

  @Column("int", { default: 1 })
  maxQuantity: number;

  @ManyToOne(() => Ingredient, (ingredient) => ingredient.config)
  @JoinColumn()
  ingredient: Ingredient;

  @ManyToMany(() => IngredientsConfig, (config) => config.ingredients, {
    nullable: true,
    onDelete: "CASCADE",
  })
  ingredientsConfiguration: IngredientsConfig[];

  @ManyToMany(
    () => CartItemConfigurableIngredient,
    (cartItemConfigurableIngredient) => cartItemConfigurableIngredient.configurableIngredient,
  )
  cartItemConfigurableIngredient: CartItemConfigurableIngredient[];

  constructor(partial?: Partial<ConfigurableIngredient>) {
    Object.assign(this, partial);
  }
}
