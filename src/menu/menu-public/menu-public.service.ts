import { Injectable, NotFoundException } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";

import { MenuEventTypes } from "@events/events";

import { MenuCategory } from "@/menu/entities/menu-category.entity";
import { MenuPositionDetails } from "@/menu/entities/menu-position-details.entity";
import { MenuPosition } from "@/menu/entities/menu-position.entity";
import { Menu } from "@/menu/entities/menu.entity";

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
        positions: {
          coreImage: true,
        },
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

  @OnEvent(MenuEventTypes.GET_SINGLE_POSITION)
  async getSinglePosition(positionId: string): Promise<MenuPosition> {
    return this.menuPositionRepository.findOne({
      where: {
        id: positionId,
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
