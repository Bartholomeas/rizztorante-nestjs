import { Check, Column, Entity, Index, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

import { MenuCategory } from "@/menu/entity/menu-category.entity";

import { MenuPositionDetails } from "./menu-position-details.entity";

@Entity()
@Check(`"price" >= 0`)
export class MenuPosition {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({ type: "int" })
  price: number;

  @Column({ default: null, nullable: true })
  description?: string;

  @Column({ type: "simple-array", nullable: true })
  ingredients?: string[];

  @Column({ type: "boolean", default: false })
  isVegetarian: boolean;

  @Column({ type: "boolean", default: false })
  isVegan: boolean;

  @Column({ type: "boolean", default: false })
  isGlutenFree: boolean;

  @Index()
  @ManyToOne(() => MenuCategory, (category) => category.positions, {
    onDelete: "CASCADE",
  })
  category: MenuCategory;

  @OneToOne(() => MenuPositionDetails, (details) => details.menuPosition, {
    onDelete: "CASCADE",
  })
  details?: MenuPositionDetails;
}
