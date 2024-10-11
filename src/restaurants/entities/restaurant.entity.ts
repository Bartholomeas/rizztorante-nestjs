import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from "typeorm";

import { Menu } from "@/menu/entities/menu.entity";
import { Order } from "@/orders/entities/order.entity";
import { User } from "@/users/entities/user.entity";

@Entity()
export class Restaurant {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  description?: string;

  @OneToMany(() => Menu, (menu) => menu.restaurant)
  @JoinColumn()
  menus: Menu[];

  @OneToMany(() => Order, (order) => order.restaurant)
  @JoinColumn()
  orders: Order[];

  @ManyToMany(() => User, (user) => user.restaurants)
  @JoinTable()
  employees: User[];
}
