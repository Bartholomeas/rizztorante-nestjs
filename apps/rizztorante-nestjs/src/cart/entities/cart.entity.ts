import { Order } from "@app/restaurant/orders/entities/order.entity";
import { User } from "@app/restaurant/users/entities/user.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

import { CartItem } from "./cart-item.entity";

@Entity()
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
