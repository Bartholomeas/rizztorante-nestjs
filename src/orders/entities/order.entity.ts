import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Cart } from "@/cart/entities/cart.entity";
import { CheckoutDto } from "@/checkout/dto/checkout.dto";
import { OrderStatus } from "@/orders/types/order-status.enum";
import { Restaurant } from "@/restaurants/entities/restaurant.entity";
import { User } from "@/users/entities/user.entity";

@Entity()
export class Order {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ unique: true })
  orderNumber: string;

  @Column({ type: "enum", enum: OrderStatus, default: OrderStatus.PENDING })
  orderStatus: OrderStatus;

  @Column({ type: "jsonb", nullable: true })
  checkoutData: CheckoutDto;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @ManyToOne(() => Cart, (cart) => cart.order, {
    cascade: true,
  })
  @JoinColumn()
  cart: Cart;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.orders)
  restaurant: Restaurant;
}
