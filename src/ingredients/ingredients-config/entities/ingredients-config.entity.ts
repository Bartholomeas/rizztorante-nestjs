import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { MenuPosition } from "@/menu/entities/menu-position.entity";

import { ConfigurableIngredient } from "./configurable-ingredient.entity";

@Entity()
export class IngredientsConfig {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => ConfigurableIngredient, (ingredient) => ingredient.ingredientsConfiguration, {
    nullable: true,
    cascade: true,
  })
  ingredients?: ConfigurableIngredient[];

  @OneToMany(() => MenuPosition, (menuPosition) => menuPosition.ingredientsConfiguration, {
    nullable: true,
    cascade: true,
  })
  menuPositions?: MenuPosition[];
}
