import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Menu } from "@/menu/entity/menu.entity";
import { MenuCategory } from "@/menu/entity/menu-category.entity";

@Injectable()
export class MenuPublicService {
  constructor(
    @InjectRepository(Menu) private readonly menuRepository: Repository<Menu>,
    @InjectRepository(MenuCategory)
    private readonly menuCategoryRepository: Repository<MenuCategory>,
  ) {}

  async getMenus(): Promise<Menu[]> {
    return this.menuRepository.find();
  }

  async getMenuCategories(): Promise<MenuCategory[]> {
    return this.menuCategoryRepository.find({
      cache: true,
      relations: {
        menu: true,
      },
    });
  }
}
