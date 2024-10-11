import { MenuPosition } from "@app/restaurant/menu/entities/menu-position.entity";
import { Menu } from "@app/restaurant/menu/entities/menu.entity";
import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class MenuCategory {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({ default: null, nullable: true })
  description?: string;

  @Index()
  @ManyToOne(() => Menu, (menu) => menu.categories, {
    onDelete: "CASCADE",
  })
  menu: Menu;

  @OneToMany(() => MenuPosition, (menuPosition) => menuPosition.category)
  positions: MenuPosition[];
}
