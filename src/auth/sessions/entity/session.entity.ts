import type { ISession } from "connect-typeorm";
import { Column, DeleteDateColumn, Entity, Index, PrimaryColumn } from "typeorm";

@Entity("sessions")
export class SessionEntity implements ISession {
  @PrimaryColumn("varchar", { length: 255 })
  id: string;

  @Index()
  @Column("bigint")
  expiredAt: number;

  @Column("timestamp", { nullable: true })
  destroyedAt?: Date;

  @Column("text")
  json: string;

  @DeleteDateColumn()
  deletedAt?: Date;
}
