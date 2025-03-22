import type { FindOneOptions, Repository } from "typeorm";

import type { MenuPosition } from "../entities/menu-position.entity";

export const MENU_POSITION_REPOSITORY_DI = Symbol.for("MENU_POSITION_REPOSITORY_DI");

export interface MenuPositionRepository extends Repository<MenuPosition> {
  findPositionById(
    id: string,
    options?: FindOneOptions<MenuPosition>,
  ): Promise<MenuPosition | null>;
}
