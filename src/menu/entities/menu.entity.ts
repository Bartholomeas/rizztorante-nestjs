import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";

import { MenuCategory } from "@/menu/entities/menu-category.entity";

@Entity()
@Unique(["slug"])
export class Menu {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ default: null, nullable: true })
  description?: string;

  @OneToMany(() => MenuCategory, (category) => category.menu)
  categories: MenuCategory[];
}
