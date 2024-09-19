import { Column, Entity, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

import { IngredientsConfiguration } from "./ingredients-configuration.entity";
import { Ingredient } from "../../entities/ingredient.entity";

@Entity()
export class ConfigurableIngredient {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("int")
  priceAdjustment: number;

  @Column("int")
  quantity: number;

  @Column("int")
  maxQuantity: number;

  @OneToOne(() => Ingredient, (ingredient) => ingredient.config)
  ingredient: Ingredient;

  @ManyToMany(() => IngredientsConfiguration, (config) => config.ingredients, { nullable: true })
  ingredientsConfiguration: IngredientsConfiguration;
}
