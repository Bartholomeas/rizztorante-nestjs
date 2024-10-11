import { Cart } from "@app/restaurant/cart/entities/cart.entity";
import { CheckoutDto } from "@app/restaurant/checkout/dto/checkout.dto";
import { OrderStatus } from "@app/restaurant/orders/types/order-status.enum";
import { User } from "@app/restaurant/users/entities/user.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

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
