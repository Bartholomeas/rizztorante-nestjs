import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";

import { MenuCategory } from "@/menu/entity/menu-category.entity";

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
  descripton: string;

  @OneToMany(() => MenuCategory, (category) => category.category)
  categories: MenuCategory;
}
