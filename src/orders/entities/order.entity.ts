import { Currency } from "@common/types/currency.type";
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
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

import { OrderDetailsEntry } from "../dto/order-details.dto";
import { PaymentDetailsDto } from "../dto/payment-details.dto";

export enum OrderPaymentStatus {
  PAID = "PAID",
  UNPAID = "UNPAID",
  OTHER = "OTHER",
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Index()
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ unique: true })
  orderNumber: string;

  @Index()
  @Column({ type: "enum", enum: OrderStatus, default: OrderStatus.NEW })
  orderStatus: OrderStatus;

  @Column({ type: "jsonb", nullable: true })
  checkoutDetails: CheckoutDto;

  @Column({ type: "jsonb", default: {} })
  orderDetails: OrderDetailsEntry;

  @Column({ type: "enum", enum: OrderPaymentStatus, default: OrderPaymentStatus.UNPAID })
  paymentStatus: OrderPaymentStatus;

  @Column({ type: "jsonb", default: {} })
  paymentDetails: PaymentDetailsDto;

  @Column({ nullable: true })
  amount: number;

  @Column({ default: Currency.PLN })
  currency: Currency;

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
