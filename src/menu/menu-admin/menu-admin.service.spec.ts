import { NotFoundException } from "@nestjs/common";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";

import { Repository } from "typeorm";

import { MenuCategory } from "@/menu/entities/menu-category.entity";
import { MenuPositionDetails } from "@/menu/entities/menu-position-details.entity";
import { MenuPosition } from "@/menu/entities/menu-position.entity";
import { Menu } from "@/menu/entities/menu.entity";

import { MenuAdminService } from "./menu-admin.service";
import { MenuPositionImage } from "../entities/menu-images.entity";

import type { CreateMenuCategoryDto } from "../dto/create/create-category.dto";
import type { CreateMenuDto } from "../dto/create/create-menu.dto";
import type { CreateMenuPositionDto } from "../dto/create/create-position.dto";
import type { UpdateMenuCategoryDto } from "../dto/update/update-category.dto";
import type { UpdateMenuDto } from "../dto/update/update-menu.dto";
import type { UpdateMenuPositionDto } from "../dto/update/update-position.dto";

describe("MenuAdminService", () => {
  let service: MenuAdminService;
  let menuRepository: Repository<Menu>;
  let menuCategoryRepository: Repository<MenuCategory>;
  let menuPositionRepository: Repository<MenuPosition>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MenuAdminService,
        {
          provide: getRepositoryToken(Menu),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(MenuCategory),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(MenuPosition),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(MenuPositionDetails),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(MenuPositionImage),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<MenuAdminService>(MenuAdminService);
    menuRepository = module.get<Repository<Menu>>(getRepositoryToken(Menu));
    menuCategoryRepository = module.get<Repository<MenuCategory>>(getRepositoryToken(MenuCategory));
    menuPositionRepository = module.get<Repository<MenuPosition>>(getRepositoryToken(MenuPosition));
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("createMenu", () => {
    const createMenuDto: CreateMenuDto = {
      name: "Pizzas",
      description: "Italian flavored Pizzas",
    };
    const createdMenu = {
      id: "0488614e-ea81-4211-9caf-fb84f620a3dc",
      name: "Pizzas",
      slug: "pizzas",
      categories: [],
    };

    beforeEach(() => {
      jest.spyOn(menuRepository, "create").mockReturnValue({
        ...createdMenu,
        description: createMenuDto.description,
      });
      jest.spyOn(menuRepository, "save").mockResolvedValue({
        ...createdMenu,
        description: createMenuDto.description,
      });
    });

    it("should create a menu with a unique slug", async () => {
      jest.spyOn(menuRepository, "findOne").mockResolvedValue(null);
      jest.spyOn(menuRepository, "count").mockResolvedValue(0);

      const result = await service.createMenu(createMenuDto);

      expect(menuRepository.create).toHaveBeenCalledWith({
        ...createMenuDto,
        slug: "pizzas",
      });
      expect(result).toHaveProperty("id");
    });

    it("should throw an error if the menu already exists", async () => {
      jest.spyOn(menuRepository, "findOne").mockResolvedValue(createdMenu as Menu);
      jest.spyOn(menuRepository, "count").mockResolvedValue(1);
      jest.spyOn(menuRepository, "save").mockRejectedValue(new Error("Menu already exists"));

      await expect(service.createMenu(createMenuDto)).rejects.toThrow("Menu already exists");
    });
  });

  describe("createCategory", () => {
    const menu = {
      id: "0488614e-ea81-4211-9caf-fb84f620a3dc",
      name: "Pizzas",
      slug: "pizzas",
      categories: [],
    };
    const createCategoryDto: CreateMenuCategoryDto = {
      menuId: menu.id,
      name: "Pizzas",
      description: "Italian flavored Pizzas",
    };
    const createdCategory = {
      id: "0488614e-ea81-4211-9caf-fb84f620a3dc",
      name: "Pizzas",
      description: "Italian flavored Pizzas",
      menu,
    };

    it("should create a category for a menu", async () => {
      jest.spyOn(menuRepository, "findOne").mockResolvedValue(menu as Menu);
      jest.spyOn(menuCategoryRepository, "create").mockReturnValue(createdCategory as MenuCategory);
      jest.spyOn(menuCategoryRepository, "save").mockResolvedValue(createdCategory as MenuCategory);

      const result = await service.createCategory(createCategoryDto);

      expect(result).toEqual(createdCategory);
    });

    it("should throw NotFoundException if menu is not found", async () => {
      jest.spyOn(menuRepository, "findOne").mockResolvedValue(null);

      await expect(service.createCategory(createCategoryDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe("createPosition", () => {
    const menuCategory = {
      id: "0488614e-ea81-4211-9caf-fb84f620a3dc",
      name: "Pizzas",
      description: "Italian flavored Pizzas",
      menu: {
        id: "1234567e-ea81-4211-9caf-fb84f620a3dc",
        name: "Main Menu",
        slug: "main-menu",
      },
    };
    const createPositionDto: CreateMenuPositionDto = {
      menuCategoryId: menuCategory.id,
      name: "Margherita",
      description: "Classic Italian pizza",
      price: 10.99,
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false,
    };
    const createdPosition = {
      id: "9876543e-ea81-4211-9caf-fb84f620a3dc",
      ...createPositionDto,
      category: menuCategory,
    };

    it("should create a position for a category", async () => {
      jest.spyOn(menuCategoryRepository, "findOne").mockResolvedValue(menuCategory as MenuCategory);
      jest
        .spyOn(menuPositionRepository, "create")
        .mockReturnValue(createdPosition as unknown as MenuPosition);
      jest
        .spyOn(menuPositionRepository, "save")
        .mockResolvedValue(createdPosition as unknown as MenuPosition);

      const result = await service.createPosition(createPositionDto);

      expect(result).toEqual(createdPosition);
      expect(menuCategoryRepository.findOne).toHaveBeenCalledWith({
        where: { id: menuCategory.id },
      });
      expect(menuPositionRepository.create).toHaveBeenCalledWith({
        ...createPositionDto,
        category: menuCategory,
      });
      expect(menuPositionRepository.save).toHaveBeenCalledWith(createdPosition);
    });

    it("should throw NotFoundException if category is not found", async () => {
      jest.spyOn(menuCategoryRepository, "findOne").mockResolvedValue(null);

      await expect(service.createPosition(createPositionDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe("updateMenu", () => {
    it("should update a menu", async () => {
      const updateMenuDto: UpdateMenuDto = {
        name: "Updated Menu",
        description: "Updated description",
      };
      const existingMenu = {
        id: "existing-menu-id",
        name: "Existing Menu",
        description: "Existing description",
      };
      jest.spyOn(menuRepository, "findOne").mockResolvedValue(existingMenu as Menu);
      jest.spyOn(menuRepository, "save").mockResolvedValue({
        ...existingMenu,
        ...updateMenuDto,
      } as Menu);

      const result = await service.updateMenu(existingMenu.id, updateMenuDto);

      expect(result).toEqual({
        ...existingMenu,
        ...updateMenuDto,
      });
      expect(menuRepository.save).toHaveBeenCalledWith({
        ...existingMenu,
        ...updateMenuDto,
      });
    });
  });
  describe("updateCategory", () => {
    it("should update a category", async () => {
      const updateCategoryDto: UpdateMenuCategoryDto = {
        name: "Updated Category",
        description: "Updated description",
        menuId: "",
      };
      const existingCategory = {
        id: "existing-category-id",
      };
      jest
        .spyOn(menuCategoryRepository, "findOne")
        .mockResolvedValue(existingCategory as MenuCategory);
      jest.spyOn(menuCategoryRepository, "save").mockResolvedValue({
        ...existingCategory,
        ...updateCategoryDto,
      } as unknown as MenuCategory);

      const result = await service.updateCategory(existingCategory.id, updateCategoryDto);

      expect(result).toEqual({
        ...existingCategory,
        ...updateCategoryDto,
      });
      expect(menuCategoryRepository.save).toHaveBeenCalledWith({
        ...existingCategory,
        ...updateCategoryDto,
      });
    });
  });
  describe("updatePosition", () => {
    it("should update a position", async () => {
      const updatePositionDto: UpdateMenuPositionDto = {
        menuCategoryId: "existing-category-id",
        name: "Updated Position",
        description: "Updated description",
        price: 15.99,
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: false,
      };
      const existingPosition: MenuPosition = {
        cartItems: [],
        id: "existing-position-id",
        name: "Existing Position",
        price: 10.99,
        category: {
          id: "existing-category-id",
          name: "Existing Category",
          description: "Existing description",
          menu: {
            id: "existing-menu-id",
            name: "Existing Menu",
            slug: "existing-menu-slug",
            description: "",
            categories: [],
          },
          positions: [],
        },
        details: new MenuPositionDetails(),
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: false,
      };
      jest
        .spyOn(menuPositionRepository, "findOne")
        .mockResolvedValue(existingPosition as MenuPosition);
      jest.spyOn(menuPositionRepository, "save").mockResolvedValue({
        ...existingPosition,
        ...updatePositionDto,
      } as unknown as MenuPosition);

      const result = await service.updatePosition(existingPosition.id, updatePositionDto);

      expect(result).toEqual({
        ...existingPosition,
        ...updatePositionDto,
      });
      expect(menuPositionRepository.save).toHaveBeenCalledWith({
        ...existingPosition,
        ...updatePositionDto,
      });
    });
  });
});
