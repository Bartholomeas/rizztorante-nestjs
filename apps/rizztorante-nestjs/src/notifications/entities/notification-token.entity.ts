import { User } from "@app/restaurant/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { Notification } from "./notification.entity";
import { NotificationDevice } from "../enums/notification-device.enum";
import { NotificationStatus } from "../enums/notification-status.enum";

@Entity()
export class NotificationToken {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  token: string;

  @Column({ type: "enum", enum: NotificationDevice, nullable: true })
  deviceType?: NotificationDevice;

  @Column({ type: "enum", enum: NotificationStatus, default: NotificationStatus.ACTIVE })
  status: NotificationStatus;

  @ManyToOne(() => User)
  @JoinColumn({ name: "userId", referencedColumnName: "id" })
  user: User;

  @ManyToMany(() => Notification, (notification) => notification)
  notifications: Notification[];
}
