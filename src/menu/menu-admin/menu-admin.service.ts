import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import slugify from "slugify";
import { Repository } from "typeorm";

import { MenuCategory } from "@/menu/entity/menu-category.entity";
import { MenuPosition } from "@/menu/entity/menu-position.entity";
import { Menu } from "@/menu/entity/menu.entity";
import { CreateMenuCategoryDto } from "@/menu/menu-admin/dto/create/create-category.dto";
import { CreateMenuDto } from "@/menu/menu-admin/dto/create/create-menu.dto";
import { CreateMenuPositionDto } from "@/menu/menu-admin/dto/create/create-position.dto";

import { CreateMenuPositionDetailsDto } from "./dto/update/create-position-details.dto";
import { UpdateMenuCategoryDto } from "./dto/update/update-category.dto";
import { UpdateMenuDto } from "./dto/update/update-menu.dto";
import { UpdateMenuPositionDetailsDto } from "./dto/update/update-position-details.dto";
import { UpdateMenuPositionDto } from "./dto/update/update-position.dto";
import { MenuPositionDetails } from "../entity/menu-position-details.entity";

@Injectable()
export class MenuAdminService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
    @InjectRepository(MenuCategory)
    private readonly menuCategoryRepository: Repository<MenuCategory>,
    @InjectRepository(MenuPosition)
    private readonly menuPositionRepository: Repository<MenuPosition>,
    @InjectRepository(MenuPositionDetails)
    private readonly menuPositionDetailsRepository: Repository<MenuPositionDetails>,
  ) {}

  // Create operations
  async createMenu(createMenuDto: CreateMenuDto): Promise<Menu> {
    const menuSlug = await this.generateUniqueSlug(createMenuDto.name);
    const menu = this.menuRepository.create({
      ...createMenuDto,
      slug: menuSlug,
    });
    return await this.menuRepository.save(menu);
  }

  async createCategory(createMenuCategoryDto: CreateMenuCategoryDto): Promise<MenuCategory> {
    const menu = await this.findMenuById(createMenuCategoryDto.menuId);
    const category = this.menuCategoryRepository.create({
      ...createMenuCategoryDto,
      menu,
    });
    return this.menuCategoryRepository.save(category);
  }

  async createPosition(createMenuPositionDto: CreateMenuPositionDto): Promise<MenuPosition> {
    const category = await this.findCategoryById(createMenuPositionDto.menuCategoryId);
    const position = this.menuPositionRepository.create({
      ...createMenuPositionDto,
      category,
    });
    return this.menuPositionRepository.save(position);
  }

  // Update operations
  async updateMenu(id: string, updateMenuDto: UpdateMenuDto): Promise<Menu> {
    const menu = await this.findMenuById(id);
    Object.assign(menu, updateMenuDto);
    return await this.menuRepository.save(menu);
  }

  async updateCategory(
    id: string,
    updateMenuCategoryDto: UpdateMenuCategoryDto,
  ): Promise<MenuCategory> {
    const category = await this.findCategoryById(id);
    if (updateMenuCategoryDto.menuId && updateMenuCategoryDto.menuId !== category.menu.id) {
      category.menu = await this.findMenuById(updateMenuCategoryDto.menuId);
    }
    Object.assign(category, updateMenuCategoryDto);
    return await this.menuCategoryRepository.save(category);
  }

  async updatePosition(
    id: string,
    updateMenuPositionDto: UpdateMenuPositionDto,
  ): Promise<MenuPosition> {
    const position = await this.findPositionById(id);
    if (
      updateMenuPositionDto.menuCategoryId &&
      updateMenuPositionDto.menuCategoryId !== position.category.id
    ) {
      position.category = await this.findCategoryById(updateMenuPositionDto.menuCategoryId);
    }
    Object.assign(position, updateMenuPositionDto);
    return await this.menuPositionRepository.save(position);
  }

  async createPositionDetails(
    positionId: string,
    createMenuPositionDetailsDto: CreateMenuPositionDetailsDto,
  ): Promise<MenuPositionDetails> {
    const position = await this.findPositionById(positionId);
    if (position?.details) throw new ConflictException("Position details already exist");
    const details = this.menuPositionDetailsRepository.create({
      ...createMenuPositionDetailsDto,
      menuPosition: position,
    });
    return this.menuPositionDetailsRepository.save(details);
  }

  async updatePositionDetails(
    positionId: string,
    updateMenuPositionDetailsDto: UpdateMenuPositionDetailsDto,
  ): Promise<MenuPositionDetails> {
    const position = await this.findPositionById(positionId);
    if (!position.details) {
      position.details = await this.menuPositionDetailsRepository.create({
        ...updateMenuPositionDetailsDto,
        menuPosition: position,
      });
    }
    Object.assign(position.details, updateMenuPositionDetailsDto);
    await this.menuPositionRepository.save(position);
    return position.details;
  }

  // Delete operations
  async deleteMenu(id: string): Promise<void> {
    const menu = await this.findMenuById(id);
    await this.menuRepository.remove(menu);
  }

  async deleteCategory(id: string): Promise<void> {
    const category = await this.findCategoryById(id);
    await this.menuCategoryRepository.remove(category);
  }

  async deletePosition(id: string): Promise<void> {
    const position = await this.findPositionById(id);
    await this.menuPositionRepository.remove(position);
  }

  // Helper methods
  private async generateUniqueSlug(name: string): Promise<string> {
    const baseSlug = slugify(name.toLowerCase());
    const existingMenu = await this.menuRepository.findOne({ where: { slug: baseSlug } });
    if (existingMenu) {
      throw new ConflictException("A menu with this name already exists");
    }
    return baseSlug;
  }

  private async findMenuById(id: string): Promise<Menu> {
    const menu = await this.menuRepository.findOne({ where: { id } });
    if (!menu) throw new NotFoundException("Menu with this id not found");
    return menu;
  }

  private async findCategoryById(id: string): Promise<MenuCategory> {
    const category = await this.menuCategoryRepository.findOne({ where: { id } });
    if (!category) throw new NotFoundException("Menu category with this id not found");
    return category;
  }

  private async findPositionById(id: string): Promise<MenuPosition> {
    const position = await this.menuPositionRepository.findOne({ where: { id } });
    if (!position) throw new NotFoundException("Menu position with this id not found");
    return position;
  }
}
