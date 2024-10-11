import { MenuPosition } from "@app/restaurant/menu/entities/menu-position.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

import { ConfigurableIngredient } from "./configurable-ingredient.entity";

@Entity()
export class IngredientsConfig {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => ConfigurableIngredient, (ingredient) => ingredient.ingredientsConfiguration, {
    nullable: true,
    cascade: true,
  })
  @JoinTable()
  configurableIngredients?: ConfigurableIngredient[];

  @ManyToMany(() => MenuPosition, (menuPosition) => menuPosition.ingredientsConfiguration, {
    nullable: true,
    cascade: true,
  })
  @JoinTable()
  menuPositions?: MenuPosition[];
}
