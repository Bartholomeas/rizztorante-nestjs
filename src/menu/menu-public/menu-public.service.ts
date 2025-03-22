import { MenuEventTypes } from "@events/events";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToInstance } from "class-transformer";
import { Repository } from "typeorm";

import { MenuPositionDetails } from "@/menu/entities/menu-position-details.entity";
import { MenuPosition } from "@/menu/entities/menu-position.entity";

import { CategoryDto } from "../dto/category.dto";
import { MenuPositionDto } from "../dto/menu-position.dto";
import { MenuDto } from "../dto/menu.dto";
import { PositionDetailsDto } from "../dto/position-details.dto";
import {
  MENU_CATEGORY_REPOSITORY_DI,
  MenuCategoryRepository,
} from "../repositories/menu-category.repository";
import { MENU_REPOSITORY_DI, MenuRepository } from "../repositories/menu.repository";

@Injectable()
export class MenuPublicService {
  constructor(
    @Inject(MENU_REPOSITORY_DI)
    private readonly menuRepository: MenuRepository,
    @Inject(MENU_CATEGORY_REPOSITORY_DI)
    private readonly menuCategoryRepository: MenuCategoryRepository,
    @InjectRepository(MenuPosition)
    private readonly menuPositionRepository: Repository<MenuPosition>,
    @InjectRepository(MenuPositionDetails)
    private readonly menuPositionDetailsRepository: Repository<MenuPositionDetails>,
  ) {}

  async getMenuBySlug(slug: string) {
    const menu = await this.menuRepository.findMenuBySlug(slug, {
      relations: {
        categories: { positions: { coreImage: true } },
      },
    });

    if (!menu) throw new NotFoundException("Menu not found");

    return menu;
  }

  async getMenus(): Promise<MenuDto[]> {
    const menus = await this.menuRepository.find({
      cache: {
        id: "menus",
        milliseconds: 1000 * 60 * 3,
      },
    });

    return plainToInstance(MenuDto, menus);
  }
  async getMenuCategories(menuSlug: string): Promise<CategoryDto[]> {
    const categories = await this.menuCategoryRepository.findCategoryByMenuSlug(menuSlug, {
      cache: {
        id: `menu-categories-${menuSlug}`,
        milliseconds: 1000 * 60,
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
