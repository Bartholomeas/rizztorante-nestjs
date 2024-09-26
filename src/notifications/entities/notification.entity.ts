import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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

  @Column({ enum: NotificationStatus, default: NotificationStatus.ACTIVE })
  status: NotificationStatus;
}
