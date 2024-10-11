import { Injectable, NotFoundException } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { InjectRepository } from "@nestjs/typeorm";

import { MenuCategory } from "@app/restaurant/menu/entities/menu-category.entity";
import { MenuPositionDetails } from "@app/restaurant/menu/entities/menu-position-details.entity";
import { MenuPosition } from "@app/restaurant/menu/entities/menu-position.entity";
import { Menu } from "@app/restaurant/menu/entities/menu.entity";
import { plainToInstance } from "class-transformer";
import { Repository } from "typeorm";

import { MenuEventTypes } from "@events/events";

import { CategoryDto } from "../dto/category.dto";
import { MenuPositionDto } from "../dto/menu-position.dto";
import { MenuDto } from "../dto/menu.dto";
import { PositionDetailsDto } from "../dto/position-details.dto";

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
  async getMenus(): Promise<MenuDto[]> {
    const menus = await this.menuRepository.find({
      cache: {
        id: "menus",
        milliseconds: 1000 * 60,
      },
    });

    return plainToInstance(MenuDto, menus);
  }
  async getMenuCategories(menuId: string): Promise<CategoryDto[]> {
    const categories = await this.menuCategoryRepository.find({
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

    return plainToInstance(CategoryDto, categories);
  }

  async getPositions(categoryId: string): Promise<MenuPositionDto[]> {
    const positions = await this.menuPositionRepository.find({
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

    return plainToInstance(MenuPositionDto, positions);
  }

  @OnEvent(MenuEventTypes.GET_SINGLE_POSITION)
  async getSinglePosition(positionId: string): Promise<MenuPosition> {
    return this.menuPositionRepository.findOne({
      where: {
        id: positionId,
      },
    });
  }

  async getPositionDetails(positionId: string): Promise<PositionDetailsDto> {
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
        menuPosition: {
          coreImage: true,
        },
        images: true,
      },
    });
    if (!positionDetails) throw new NotFoundException("Position details not found");

    return plainToInstance(PositionDetailsDto, positionDetails);
  }
}
