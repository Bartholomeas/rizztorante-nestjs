import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

import { NotificationToken } from "./notification-token.entity";
import { NotificationStatus } from "../enums/notification-status.enum";

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

  // @Column({ enum: NotificationStatus, default: NotificationStatus.ACTIVE })
  @Column({ type: "enum", enum: NotificationStatus, default: NotificationStatus.ACTIVE })
  status: NotificationStatus;

  @ManyToMany(() => NotificationToken, (notificationToken) => notificationToken.notifications)
  @JoinTable()
  notificationTokens: NotificationToken[];
}
