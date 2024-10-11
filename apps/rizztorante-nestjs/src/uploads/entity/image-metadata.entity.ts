import { Column, PrimaryColumn } from "typeorm";

export abstract class ImageMetadata {
  @PrimaryColumn()
  id: string;

  @Column()
  url: string;

  @Column({ nullable: true })
  alt?: string;

  @Column({ nullable: true })
  caption?: string;
}
