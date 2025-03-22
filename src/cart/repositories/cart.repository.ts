import type { Repository } from "typeorm";

import type { Cart } from "../entities/cart.entity";

export const CART_REPOSITORY_DI = Symbol.for("CART_REPOSITORY_DI");

export interface CartRepository extends Repository<Cart> {
  findCartByUserId(userId: string): Promise<Cart | null>;
}
