import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";

import { MenuCategory } from "@/menu/entities/menu-category.entity";
import { Restaurant } from "@/restaurants/entities/restaurant.entity";

@Entity({ schema: "menu" })
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

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.menus)
  restaurant: Restaurant;
}
