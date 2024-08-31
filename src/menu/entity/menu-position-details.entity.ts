import {
  Check,
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { MenuPosition } from "./menu-position.entity";

@Entity()
@Check(`"price" >= 0`)
export class MenuPositionDetails {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({ type: "int" })
  price: number;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ type: "text", nullable: true })
  longDescription?: string;

  @Column({ type: "simple-array", nullable: true })
  images?: string[];

  @Column({ type: "int", nullable: true })
  calories?: number;

  @Column({ type: "simple-array", nullable: true })
  allergens?: string[];

  @Column({ type: "simple-array", nullable: true })
  ingredients?: string[];

  @Column({ type: "boolean", default: false })
  isVegetarian: boolean;

  @Column({ type: "boolean", default: false })
  isVegan: boolean;

  @Column({ type: "boolean", default: false })
  isGlutenFree: boolean;

  @Column({ type: "int", nullable: true })
  preparationTime?: number;

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
