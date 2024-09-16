import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PositionIngredients {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  positionId: string;

  @Column()
  ingredientId: string;
}
