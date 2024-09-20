import { Column, Entity, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

import { IngredientsConfig } from "./ingredients-config.entity";
import { Ingredient } from "../../entities/ingredient.entity";

@Entity()
export class CustomIngredient {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("int", { default: 0 })
  priceAdjustment: number;

  @Column("int", { default: 1 })
  quantity: number;

  @Column("int", { default: 1 })
  maxQuantity: number;

  @OneToOne(() => Ingredient, (ingredient) => ingredient.config)
  ingredient: Ingredient;

  // @ManyToMany(() => CartItem, (cartItem) => cartItem.customIngredients)
  // cartItems: CartItem[];

  @ManyToMany(() => IngredientsConfig, (config) => config.ingredients, { nullable: true })
  ingredientsConfiguration: IngredientsConfig;
}
