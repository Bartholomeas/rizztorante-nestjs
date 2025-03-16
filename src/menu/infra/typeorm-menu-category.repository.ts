import { Injectable } from "@nestjs/common";
import { DataSource, FindOneOptions, Repository } from "typeorm";
import { MenuCategoryRepository } from "../repositories/menu-category.repository";
import { MenuCategory } from "../entities/menu-category.entity";

@Injectable()
export class TypeormMenuCategoryRepository
  extends Repository<MenuCategory>
  implements MenuCategoryRepository
{
  constructor(dataSource: DataSource) {
    super(MenuCategory, dataSource.createEntityManager());
  }

  async findCategoryByMenuSlug(
    slug: string,
    options: FindOneOptions<MenuCategory> = {},
  ): Promise<MenuCategory[] | null> {
    return await this.find({
      where: { menu: { slug } },
      cache: {
        id: `menu-category-${slug}`,
        milliseconds: 1000 * 60 * 3,
      },
      ...options,
    });
  }
}
