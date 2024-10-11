import { MenuCategory } from "@app/restaurant/menu/entities/menu-category.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";

import { Restaurant } from "@app/admin/restaurants/entities/restaurant.entity";

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

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.menus)
  restaurant: Restaurant;
}
