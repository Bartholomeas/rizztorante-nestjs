import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

import { Order } from "@/orders/entities/order.entity";
import { User } from "@/users/entities/user.entity";

import { CartItem } from "./cart-item.entity";

@Entity({ schema: "cart" })
export class Cart {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ default: 0 })
  total: number;

  @OneToMany(() => CartItem, (item) => item.cart, {
    eager: true,
    cascade: true,
  })
  items: CartItem[];

  @OneToOne(() => User, (user) => user.cart)
  @JoinColumn()
  user: User;

  @OneToMany(() => Order, (order) => order.cart, {
    nullable: true,
  })
  order: Order;
}
