import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Cart } from "../entities/cart.entity";
import { CartRepository } from "../repositories/cart.repository";
import { User } from "@/users/entities/user.entity";

@Injectable()
export class TypeormCartRepository extends Repository<Cart> implements CartRepository {
  constructor(dataSource: DataSource) {
    super(Cart, dataSource.createEntityManager());
  }

  async findCartByUserId(userId: string): Promise<Cart | null> {
    return this.createQueryBuilder("cart")
      .innerJoin(User, "user", "user.id = cart.user.id")
      .leftJoinAndSelect("cart.items", "items")
      .leftJoinAndSelect("items.menuPosition", "menuPosition")
      .leftJoinAndSelect("menuPosition.coreImage", "coreImage")
      .leftJoinAndSelect("items.ingredients", "ingredients")
      .leftJoinAndSelect("ingredients.configurableIngredient", "configurableIngredient")
      .where("user.id = :userId", { userId })
      .getOne();
  }
}
