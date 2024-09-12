import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class SpecialDate {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ default: false })
  isClosed: boolean;

  @Column({ type: "date" })
  date: string;

  @Column({ type: "time", nullable: true })
  openingTime: string;

  @Column({ type: "time", nullable: true })
  closingTime: string;

  @Column({ type: "text", nullable: true })
  description?: string;
}
