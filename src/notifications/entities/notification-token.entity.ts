import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { User } from "@/users/entities/user.entity";

import { NotificationDevice } from "../enums/notification-device.enum";
import { NotificationStatus } from "../enums/notification-status.enum";

import { Notification } from "./notification.entity";

@Entity()
export class NotificationToken {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  token: string;

  @Column({ enum: NotificationDevice, nullable: true })
  deviceType?: NotificationDevice;

  @Column({ enum: NotificationStatus, default: NotificationStatus.ACTIVE })
  status: NotificationStatus;

  @ManyToOne(() => User)
  @JoinColumn({ name: "userId", referencedColumnName: "id" })
  user: User;

  @ManyToMany(() => Notification, (notification) => notification)
  notifications: Notification[];
}
