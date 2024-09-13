import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Opinion {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ default: false })
  isApproved: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  name: string;

  @Column({
    type: "decimal",
  })
  rate: number;

  @Column({ nullable: true })
  comment: string;
}
