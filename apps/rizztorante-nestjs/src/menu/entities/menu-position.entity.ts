import { CartItem } from "@app/restaurant/cart/entities/cart-item.entity";
import { IngredientsConfig } from "@app/restaurant/ingredients/ingredients-config/entities/ingredients-config.entity";
import { MenuCategory } from "@app/restaurant/menu/entities/menu-category.entity";
import {
  Check,
  Column,
  Entity,
  Index,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { MenuPositionImage } from "./menu-images.entity";
import { MenuPositionDetails } from "./menu-position-details.entity";
import { Ingredient } from "../../ingredients/entities/ingredient.entity";

@Entity()
@Check(`"price" >= 0`)
export class MenuPosition {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({ type: "int" })
  price: number;

  @OneToOne(() => MenuPositionImage, (img) => img.menuPosition, {
    cascade: true,
    onDelete: "CASCADE",
  })
  coreImage?: MenuPositionImage;

  @Column({ default: null, nullable: true })
  description?: string;

  // @Column({ type: "simple-array", nullable: true })
  @ManyToMany(() => Ingredient, (ingredient) => ingredient.menuPosition, {
    nullable: true,
  })
  ingredients?: Ingredient[];

  @Column({ type: "boolean", default: false })
  isVegetarian: boolean;

  @Column({ type: "boolean", default: false })
  isVegan: boolean;

  @Column({ type: "boolean", default: false })
  isGlutenFree: boolean;

  @Index()
  @ManyToOne(() => MenuCategory, (category) => category.positions, {
    onDelete: "CASCADE",
  })
  category: MenuCategory;

  @OneToOne(() => MenuPositionDetails, (details) => details.menuPosition, {
    onDelete: "CASCADE",
  })
  details?: MenuPositionDetails;

  @OneToMany(() => CartItem, (cartItem) => cartItem.menuPosition)
  cartItems: CartItem[];

  @ManyToMany(
    () => IngredientsConfig,
    (ingredientsConfiguration) => ingredientsConfiguration.menuPositions,
    {
      nullable: true,
    },
  )
  ingredientsConfiguration?: IngredientsConfig[];
}
