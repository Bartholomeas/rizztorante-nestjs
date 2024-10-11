import { CartItemConfigurableIngredient } from "@app/restaurant/cart/entities/cart-item-configurable-ingredient.entity";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

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

  @ManyToMany(() => IngredientsConfig, (config) => config.configurableIngredients, {
    nullable: true,
    onDelete: "CASCADE",
  })
  ingredientsConfiguration: IngredientsConfig[];

  @OneToMany(
    () => CartItemConfigurableIngredient,
    (cartItemConfigurableIngredient) => cartItemConfigurableIngredient.configurableIngredient,
  )
  cartItemConfigurableIngredient: CartItemConfigurableIngredient;

  constructor(partial?: Partial<ConfigurableIngredient>) {
    Object.assign(this, partial);
  }
}
