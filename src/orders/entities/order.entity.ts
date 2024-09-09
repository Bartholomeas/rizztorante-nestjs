import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { User } from "@/auth/entities/user.entity";
import { Cart } from "@/cart/entities/cart.entity";
import { CheckoutDto } from "@/checkout/dto/checkout.dto";
import { OrderStatus } from "@/orders/types/order-status.enum";

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
}
