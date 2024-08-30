import { Check, Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { MenuCategory } from "@/menu/entity/menu-category.entity";

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

  @Index()
  @ManyToOne(() => MenuCategory, (category) => category.positions, {
    onDelete: "CASCADE",
  })
  category: MenuCategory;
}
