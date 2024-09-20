import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { MenuPosition } from "@/menu/entities/menu-position.entity";

import { CustomIngredient } from "./custom-ingredient.entity";

@Entity()
export class IngredientsConfig {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => CustomIngredient, (ingredient) => ingredient.ingredientsConfiguration, {
    nullable: true,
    cascade: true,
  })
  ingredients?: CustomIngredient[];

  @OneToMany(() => MenuPosition, (menuPosition) => menuPosition.ingredientsConfiguration, {
    nullable: true,
    cascade: true,
  })
  menuPositions?: MenuPosition[];
}
