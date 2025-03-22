import type { FindOneOptions, Repository } from "typeorm";

import type { Menu } from "../entities/menu.entity";

export const MENU_REPOSITORY_DI = Symbol.for("MENU_REPOSITORY_DI");

export interface MenuRepository extends Repository<Menu> {
  findMenuBySlug(slug: string, options?: FindOneOptions<Menu>): Promise<Menu | null>;
}
