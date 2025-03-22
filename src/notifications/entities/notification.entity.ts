import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

import { NotificationStatus } from "../enums/notification-status.enum";

import { NotificationToken } from "./notification-token.entity";

@Entity()
export class Notification {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column({ type: "text", nullable: true })
  body: string;

  @Column()
  createdBy: string;

  @Column({ enum: NotificationStatus, default: NotificationStatus.ACTIVE })
  status: NotificationStatus;

  @ManyToMany(() => NotificationToken, (notificationToken) => notificationToken.notifications)
  @JoinTable()
  notificationTokens: NotificationToken[];
}
