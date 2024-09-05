import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { MenuPosition } from "@/menu/entities/menu-position.entity";

import { Cart } from "./cart.entity";

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("int", { default: 1 })
  quantity: number;

  @Column("int", { default: 0 })
  amount: number;

  @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: "CASCADE" })
  cart: Cart;

  @ManyToOne(() => MenuPosition, (menuPosition) => menuPosition.cartItems)
  menuPosition: MenuPosition;
}
