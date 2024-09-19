import { Column, Entity, JoinColumn, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

import { IngredientImage } from "./ingredient-image.entity";
import { MenuPosition } from "../../menu/entities/menu-position.entity";
import { ConfigurableIngredient } from "../ingredients-configuration/entities/configurable-ingredient.entity";

@Entity()
export class Ingredient {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @OneToOne(() => IngredientImage, (image) => image.ingredient, { nullable: true })
  @JoinColumn()
  image?: IngredientImage;

  @Column({ type: "boolean", default: true })
  isAvailable?: boolean;

  @Column({ type: "boolean", default: false })
  isVegan?: boolean;

  @Column({ type: "boolean", default: false })
  isVegetarian?: boolean;

  @Column({ type: "boolean", default: false })
  isGlutenFree?: boolean;

  @ManyToMany(() => MenuPosition, (position) => position.ingredients, {
    nullable: true,
  })
  menuPosition?: MenuPosition[];

  @OneToOne(() => ConfigurableIngredient, (config) => config.ingredient, {
    nullable: true,
    cascade: true,
    onDelete: "CASCADE",
  })
  config?: ConfigurableIngredient;
}
