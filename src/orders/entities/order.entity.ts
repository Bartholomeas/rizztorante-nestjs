import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { User } from "@/auth/entities/user.entity";

@Entity()
export class Order {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("decimal")
  totalAmount: number;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;
}
