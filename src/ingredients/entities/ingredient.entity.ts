import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

import { MenuPosition } from "../../menu/entities/menu-position.entity";

@Entity()
export class Ingredient {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

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
}
