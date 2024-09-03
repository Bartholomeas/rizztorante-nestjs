import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

import { User } from "@/auth/entity/user.entity";

import { CartItem } from "./cart-item.entity";

@Entity()
export class Cart {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ default: 0 })
  total: number;

  @OneToMany(() => CartItem, (items) => items.cart, { onDelete: "CASCADE" })
  items?: CartItem[];

  @OneToOne(() => User, (user) => user.cart)
  user: User;
}
