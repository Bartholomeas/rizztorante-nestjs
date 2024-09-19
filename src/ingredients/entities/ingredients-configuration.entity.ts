import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { ConfigurableIngredient } from "./configurable-ingredient.entity";

@Entity()
export class IngredientsConfiguration {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @OneToMany(() => ConfigurableIngredient, (ingredient) => ingredient.ingredientsConfiguration, {
    nullable: true,
  })
  ingredients: ConfigurableIngredient[];
}
