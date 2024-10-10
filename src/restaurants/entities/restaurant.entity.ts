import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { Employee } from "@/employees/entities/employee.entity";
import { Menu } from "@/menu/entities/menu.entity";

@Entity()
export class Restaurant {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @OneToMany(() => Employee, (employee) => employee.restaurant)
  @JoinColumn()
  employees: Employee[];

  @OneToMany(() => Menu, (menu) => menu.restaurant, { onDelete: "CASCADE" })
  @JoinColumn()
  menus: Menu[];
}
