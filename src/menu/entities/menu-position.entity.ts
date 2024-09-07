import {
  Check,
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { CartItem } from "@/cart/entities/cart-item.entity";
import { MenuCategory } from "@/menu/entities/menu-category.entity";

import { MenuPositionDetails } from "./menu-position-details.entity";

@Entity()
@Check(`"price" >= 0`)
export class MenuPosition {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({ type: "int" })
  price: number;

  @Column({ type: "simple-array", nullable: true, array: true })
  images?: string[];

  @Column({ default: null, nullable: true })
  description?: string;

  @Column({ type: "simple-array", nullable: true })
  ingredients?: string[];

  @Column({ type: "boolean", default: false })
  isVegetarian: boolean;

  @Column({ type: "boolean", default: false })
  isVegan: boolean;

  @Column({ type: "boolean", default: false })
  isGlutenFree: boolean;

  @Index()
  @ManyToOne(() => MenuCategory, (category) => category.positions, {
    onDelete: "CASCADE",
  })
  category: MenuCategory;

  @OneToOne(() => MenuPositionDetails, (details) => details.menuPosition, {
    onDelete: "CASCADE",
  })
  details?: MenuPositionDetails;

  @OneToMany(() => CartItem, (cartItem) => cartItem.menuPosition)
  cartItems: CartItem[];
}
