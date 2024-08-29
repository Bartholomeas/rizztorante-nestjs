import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Menu {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column("jsonb", { nullable: true })
  options: string[];
}
