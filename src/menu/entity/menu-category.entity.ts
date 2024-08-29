import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { MenuPosition } from "@/menu/entity/menu-position.entity";

@Entity()
export class MenuCategory {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  category: string;

  @Column({ default: null })
  description: string;

  @OneToMany(() => MenuPosition, (menuPosition) => menuPosition.id)
  positions: MenuPosition[];
}
