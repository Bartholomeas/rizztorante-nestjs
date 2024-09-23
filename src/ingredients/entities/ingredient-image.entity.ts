import { Entity, OneToOne } from "typeorm";

import { ImageMetadata } from "@/uploads/entity/image-metadata.entity";

import { Ingredient } from "./ingredient.entity";

@Entity()
export class IngredientImage extends ImageMetadata {
  @OneToOne(() => Ingredient, (ingredient) => ingredient.image)
  ingredient: Ingredient;
}
