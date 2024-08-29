import { Check, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

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

  @ManyToOne(() => MenuCategory, (category) => category.id)
  category: MenuCategory;
}
