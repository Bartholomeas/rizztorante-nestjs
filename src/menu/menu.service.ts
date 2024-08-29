import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Like, Repository } from "typeorm";
import slugify from "slugify";

import { Menu } from "@/menu/entity/menu.entity";
import { MenuCategory } from "@/menu/entity/menu-category.entity";
import { MenuPosition } from "@/menu/entity/menu-position.entity";
import { CreateMenuDto } from "@/menu/dto/create-menu.dto";

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
    @InjectRepository(MenuCategory)
    private readonly menuCategoryRepository: Repository<MenuCategory>,
    @InjectRepository(MenuPosition)
    private readonly menuPositionRepository: Repository<MenuPosition>,
  ) {}

  async getAll(): Promise<Menu[]> {
    return this.menuRepository.find();
  }

  async createMenu(createMenuDto: CreateMenuDto): Promise<Menu> {
    try {
      const menuSlug = slugify(createMenuDto?.name?.toLowerCase());

      const slugCount = await this.menuRepository.count({
        where: {
          slug: Like(`${menuSlug}%`),
        },
      });

      const menu = this.menuRepository.create({
        ...createMenuDto,
        slug: slugCount > 0 ? `${menuSlug}-${slugCount + 1}` : menuSlug,
      });
      return await this.menuRepository.save(menu);
    } catch (err) {
      throw err;
    }
  }

  async createCategory(): Promise<MenuCategory> {
    const category = this.menuCategoryRepository.create({
      name: "Pizza",
      category: "pizza",
    });

    return this.menuCategoryRepository.save(category);
  }

  async createPosition(): Promise<Menu> {
    const category = this.menuCategoryRepository.create({ name: "Pizza" });

    const newPosition = this.menuPositionRepository.create({
      name: "Pizza Margherita",
      price: 2739,
      category,
    });
    const newPosition2 = this.menuPositionRepository.create({
      name: "Pizza Capriciosa",
      price: 3245,
      category,
    });
    // const menu = this.menuRepository.create({
    //   name: "Menu test",
    //   options: ["testowe", "costam"],
    //   categories: [
    //     {
    //       name: "ssss",
    //       description: "SDFASDFADSF",
    //     },
    //   ],
    // });
    //
    // return this.menuRepository.save(menu);
    return {} as Menu;
  }
}
