import { IsEmail, IsStrongPassword, ValidateIf } from "class-validator";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { UserRole } from "@/_common/types/user-roles.type";
import { Cart } from "@/cart/entities/cart.entity";
import { Order } from "@/orders/entities/order.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ unique: true, nullable: true })
  @ValidateIf((o) => o.role !== UserRole.GUEST)
  @IsEmail({}, { message: "Email is not valid" })
  email?: string;

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
}
