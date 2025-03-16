import type { FindOneOptions, Repository } from "typeorm";
import type { MenuCategory } from "../entities/menu-category.entity";

export const MENU_CATEGORY_REPOSITORY_DI = Symbol.for("MENU_CATEGORY_REPOSITORY_DI");

export interface MenuCategoryRepository extends Repository<MenuCategory> {
  findCategoryByMenuSlug(
    slug: string,
    options?: FindOneOptions<MenuCategory>,
  ): Promise<MenuCategory[] | null>;
}
