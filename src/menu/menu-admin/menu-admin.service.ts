import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import slugify from "slugify";
import { Like, Repository } from "typeorm";

import { MenuCategory } from "@/menu/entity/menu-category.entity";
import { MenuPosition } from "@/menu/entity/menu-position.entity";
import { Menu } from "@/menu/entity/menu.entity";
import { CreateMenuCategoryDto } from "@/menu/menu-admin/dto/create/create-category.dto";
import { CreateMenuDto } from "@/menu/menu-admin/dto/create/create-menu.dto";
import { CreateMenuPositionDto } from "@/menu/menu-admin/dto/create/create-position.dto";

import { UpdateMenuCategoryDto } from "./dto/update/update-category.dto";
import { UpdateMenuDto } from "./dto/update/update-menu.dto";
import { UpdateMenuPositionDto } from "./dto/update/update-position.dto";

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

  // Create operations
  async createMenu(createMenuDto: CreateMenuDto): Promise<Menu> {
    const menuSlug = await this.generateSlug(createMenuDto.name);
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
  private async generateSlug(name: string): Promise<string> {
    const baseSlug = slugify(name.toLowerCase());
    const slugCount = await this.menuRepository.count({
      where: { slug: Like(`${baseSlug}%`) },
    });
    return slugCount > 0 ? `${baseSlug}-${slugCount + 1}` : baseSlug;
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
