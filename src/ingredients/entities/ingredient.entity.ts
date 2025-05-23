import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { MenuPosition } from "../../menu/entities/menu-position.entity";
import { ConfigurableIngredient } from "../ingredients-config/entities/configurable-ingredient.entity";

import { IngredientImage } from "./ingredient-image.entity";

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

  @OneToMany(() => ConfigurableIngredient, (config) => config.ingredient, {
    nullable: true,
    cascade: true,
    onDelete: "CASCADE",
  })
  config?: ConfigurableIngredient;
}
