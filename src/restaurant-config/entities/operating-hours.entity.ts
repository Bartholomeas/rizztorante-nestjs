import { Check, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
@Check(`"closingTime" > "openingTime"`)
export class OperatingHours {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "enum",
    enum: [0, 1, 2, 3, 4, 5, 6],
  })
  dayOfWeek: number;

  @Column({ default: false })
  isClosed: boolean;

  @Column({ type: "time", nullable: true })
  openingTime: string;

  @Column({ type: "time", nullable: true })
  closingTime: string;
}
