import { Exclude } from "class-transformer";
import { IsEmail, IsStrongPassword, ValidateIf } from "class-validator";
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { UserRole } from "@/_common/types/user-roles.type";
import { Cart } from "@/cart/entities/cart.entity";
import { NotificationToken } from "@/notifications/entities/notification-token.entity";
import { Order } from "@/orders/entities/order.entity";
import { Restaurant } from "@/restaurants/entities/restaurant.entity";

@Entity({ schema: "user" })
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ unique: true, nullable: true })
  @Index({ unique: true })
  @ValidateIf((o) => o.role !== UserRole.GUEST)
  @IsEmail({}, { message: "Email is not valid" })
  email?: string;

  @Exclude()
  @Column({ nullable: true })
  @ValidateIf((o) => o.role !== UserRole.GUEST)
  @IsStrongPassword({
    minLength: 8,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
    minLowercase: 1,
  })
  password: string;

  @Column({ type: "enum", enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @OneToOne(() => Cart, (cart) => cart.user, {
    nullable: true,
    cascade: true,
  })
  @JoinColumn()
  cart?: Cart;

  @OneToMany(() => Order, (order) => order.user)
  @JoinColumn()
  orders: Order[];

  @OneToMany(() => NotificationToken, (notificationToken) => notificationToken.user, {
    nullable: true,
  })
  notificationTokens?: NotificationToken[];

  @ManyToMany(() => Restaurant, (restaurant) => restaurant.employees)
  restaurants: Restaurant[];
}
