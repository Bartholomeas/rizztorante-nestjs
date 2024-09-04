import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, JoinColumn } from "typeorm";

import { User } from "@/auth/entity/user.entity";

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
}
