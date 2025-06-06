import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { MenuPosition } from "@/menu/entities/menu-position.entity";

import { CartItemConfigurableIngredient } from "./cart-item-configurable-ingredient.entity";
import { Cart } from "./cart.entity";

@Entity({ schema: "cart" })
export class CartItem {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("int", { default: 1 })
  quantity: number;

  @Column("int", { default: 0 })
  amount: number;

  @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: "CASCADE" })
  cart: Cart;

  @Index()
  @ManyToOne(() => MenuPosition, (menuPosition) => menuPosition.cartItems)
  menuPosition: MenuPosition;

  @ManyToMany(() => CartItemConfigurableIngredient, (ingredient) => ingredient.cartItem)
  @JoinTable()
  ingredients?: CartItemConfigurableIngredient[];
}
