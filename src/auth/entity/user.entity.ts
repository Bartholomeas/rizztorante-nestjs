import { IsEmail, IsString } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

import { UserRole } from "@/types/user-roles";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ unique: true })
  @IsEmail({}, { message: "Email is not valid" })
  email: string;

  @Column()
  @IsString()
  password: string;

  @Column({ type: "enum", enum: UserRole, default: UserRole.USER })
  role: UserRole.USER;
}
