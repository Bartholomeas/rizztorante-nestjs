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
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  rate: number;

  @Column({ nullable: true })
  comment: string;
}
