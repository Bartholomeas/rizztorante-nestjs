import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { MenuPositionDetailsImage } from "./menu-images.entity";
import { MenuPosition } from "./menu-position.entity";

@Entity()
export class MenuPositionDetails {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "text", nullable: true })
  longDescription?: string;

  @OneToMany(() => MenuPositionDetailsImage, (img) => img.menuPositionDetails, {
    cascade: true,
    onDelete: "CASCADE",
  })
  images?: MenuPositionDetailsImage[];

  @Column({ type: "int", nullable: true })
  calories?: number;

  @Column({ type: "simple-array", nullable: true })
  allergens?: string[];

  @Column({ type: "simple-json", nullable: true })
  nutritionalInfo?: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };

  @Index()
  @OneToOne(() => MenuPosition, (menuPosition) => menuPosition.details, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  menuPosition: MenuPosition;
}
