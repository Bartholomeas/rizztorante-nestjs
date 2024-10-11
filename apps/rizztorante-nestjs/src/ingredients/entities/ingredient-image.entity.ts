import { ImageMetadata } from "@app/restaurant/uploads/entity/image-metadata.entity";
import { Entity, OneToOne } from "typeorm";

import { Ingredient } from "./ingredient.entity";

@Entity()
export class IngredientImage extends ImageMetadata {
  @OneToOne(() => Ingredient, (ingredient) => ingredient.image)
  ingredient: Ingredient;
}
