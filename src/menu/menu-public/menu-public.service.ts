import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";

import { MenuCategory } from "@/menu/entity/menu-category.entity";
import { Menu } from "@/menu/entity/menu.entity";

import { MenuPositionDetails } from "../entity/menu-position-details.entity";
import { MenuPosition } from "../entity/menu-position.entity";

@Injectable()
export class MenuPublicService {
  constructor(
    @InjectRepository(Menu) private readonly menuRepository: Repository<Menu>,
    @InjectRepository(MenuCategory)
    private readonly menuCategoryRepository: Repository<MenuCategory>,
    @InjectRepository(MenuPosition)
    private readonly menuPositionRepository: Repository<MenuPosition>,
    @InjectRepository(MenuPositionDetails)
    private readonly menuPositionDetailsRepository: Repository<MenuPositionDetails>,
  ) {}

  async getMenus(): Promise<Menu[]> {
    return this.menuRepository.find({
      cache: {
        id: "menus",
        milliseconds: 1000 * 60,
      },
    });
  }

  async getMenuCategories(menuId: string): Promise<MenuCategory[]> {
    return this.menuCategoryRepository.find({
      cache: {
        id: `menu-categories-${menuId}`,
        milliseconds: 1000 * 60,
      },
      where: {
        menu: {
          id: menuId,
        },
      },
      relations: {
        positions: true,
      },
    });
  }

  async getPositions(categoryId: string): Promise<MenuPosition[]> {
    return this.menuPositionRepository.find({
      cache: {
        id: `menu-positions-${categoryId}`,
        milliseconds: 1000 * 60,
      },
      where: {
        category: {
          id: categoryId,
        },
      },
      relations: {
        category: true,
      },
    });
  }

  async getPositionDetails(positionId: string): Promise<MenuPositionDetails> {
    const positionDetails = await this.menuPositionDetailsRepository.findOne({
      where: {
        menuPosition: {
          id: positionId,
        },
      },
      cache: {
        id: `menu-position-details-${positionId}`,
        milliseconds: 1000 * 60,
      },
      relations: {
        menuPosition: true,
      },
    });
    if (!positionDetails) throw new NotFoundException("Position details not found");

    return positionDetails;
  }
}
