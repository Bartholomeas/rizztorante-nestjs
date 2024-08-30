import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import slugify from "slugify";
import { Like, Repository } from "typeorm";

import { Menu } from "@/menu/entity/menu.entity";
import { MenuCategory } from "@/menu/entity/menu-category.entity";
import { MenuPosition } from "@/menu/entity/menu-position.entity";
import { CreateMenuDto } from "@/menu/menu-admin/dto/create-menu.dto";
import { CreateMenuCategoryDto } from "@/menu/menu-admin/dto/create-category.dto";

@Injectable()
export class MenuAdminService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
    @InjectRepository(MenuCategory)
    private readonly menuCategoryRepository: Repository<MenuCategory>,
    @InjectRepository(MenuPosition)
    private readonly menuPositionRepository: Repository<MenuPosition>,
  ) {}

  async createMenu(createMenuDto: CreateMenuDto): Promise<Menu> {
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
  }

  async createCategory(createMenuCategoryDto: CreateMenuCategoryDto): Promise<MenuCategory> {
    const menu = await this.menuRepository.findOne({
      where: {
        id: createMenuCategoryDto.menuId,
      },
    });

    if (!menu) throw new NotFoundException("Menu with this id not found");

    const category = this.menuCategoryRepository.create({
      name: createMenuCategoryDto.name,
      description: createMenuCategoryDto.description,
      menu,
    });

    return this.menuCategoryRepository.save(category);
  }

  async createPosition(): Promise<Menu> {
    // const category = this.menuCategoryRepository.create({ name: "Pizza" });

    // const newPosition = this.menuPositionRepository.create({
    //   name: "Pizza Margherita",
    //   price: 2739,
    //   category,
    // });
    // const newPosition2 = this.menuPositionRepository.create({
    //   name: "Pizza Capriciosa",
    //   price: 3245,
    //   category,
    // });
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
