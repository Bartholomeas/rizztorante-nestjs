import { InternalServerErrorException } from "@nestjs/common";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";

import { Repository } from "typeorm";

import { MenuCategory } from "@/menu/entities/menu-category.entity";
import { MenuPositionDetails } from "@/menu/entities/menu-position-details.entity";
import { MenuPosition } from "@/menu/entities/menu-position.entity";
import { Menu } from "@/menu/entities/menu.entity";

import { MenuAdminController } from "./menu-admin.controller";
import { MenuAdminService } from "./menu-admin.service";
import { MenuPositionImage } from "../entities/menu-images.entity";

import type { CreateMenuCategoryDto } from "./dto/create/create-category.dto";
import type { CreateMenuDto } from "./dto/create/create-menu.dto";
import type { CreateMenuPositionDto } from "./dto/create/create-position.dto";
import type { UpdateMenuCategoryDto } from "./dto/update/update-category.dto";
import type { UpdateMenuDto } from "./dto/update/update-menu.dto";
import type { UpdateMenuPositionDto } from "./dto/update/update-position.dto";

describe("MenuAdminController", () => {
  let menuAdminController: MenuAdminController;
  let menuAdminService: MenuAdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MenuAdminController],
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

    menuAdminController = module.get<MenuAdminController>(MenuAdminController);
    menuAdminService = module.get<MenuAdminService>(MenuAdminService);
  });
  describe("createMenu", () => {
    it("should create a new menu", async () => {
      const createMenuDto: CreateMenuDto = {
        name: "Test Menu",
        description: "",
      };
      const result = {
        id: "1",
        ...createMenuDto,
      };
      jest.spyOn(menuAdminService, "createMenu").mockResolvedValue(result as Menu);

      const createdMenu = await menuAdminController.createMenu(createMenuDto);

      expect(createdMenu).toBe(result);
      expect(menuAdminService.createMenu).toHaveBeenCalledWith(createMenuDto);
    });

    it("should throw an InternalServerErrorException when service throws an error", async () => {
      const createMenuDto: CreateMenuDto = {
        name: "Test Menu",
        description: "",
      };
      jest.spyOn(menuAdminService, "createMenu").mockRejectedValue(new Error("Service error"));

      await expect(menuAdminController.createMenu(createMenuDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe("updateMenu", () => {
    it("should update a menu by id", async () => {
      const menuId = "1";
      const updateMenuDto: UpdateMenuDto = {
        name: "Updated Menu",
        description: "",
      };
      const result = {
        id: menuId,
        ...updateMenuDto,
      };
      jest.spyOn(menuAdminService, "updateMenu").mockResolvedValue(result as Menu);

      const updatedMenu = await menuAdminController.updateMenu(menuId, updateMenuDto);

      expect(updatedMenu).toBe(result);
      expect(menuAdminService.updateMenu).toHaveBeenCalledWith(menuId, updateMenuDto);
    });

    it("should throw an InternalServerErrorException when service throws an error", async () => {
      const menuId = "1";
      const updateMenuDto: UpdateMenuDto = {
        name: "Updated Menu",
        description: "",
      };
      jest.spyOn(menuAdminService, "updateMenu").mockRejectedValue(new Error("Service error"));

      await expect(menuAdminController.updateMenu(menuId, updateMenuDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe("deleteMenu", () => {
    it("should delete a menu by id", async () => {
      const menuId = "1";

      jest.spyOn(menuAdminService, "deleteMenu").mockResolvedValue(undefined);

      await menuAdminController.deleteMenu(menuId);

      expect(menuAdminService.deleteMenu).toHaveBeenCalledWith(menuId);
    });

    it("should throw an InternalServerErrorException when service throws an error", async () => {
      const menuId = "1";
      jest.spyOn(menuAdminService, "deleteMenu").mockRejectedValue(new Error("Service error"));

      await expect(menuAdminController.deleteMenu(menuId)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe("createCategory", () => {
    it("should create a new menu category", async () => {
      const createMenuCategoryDto: CreateMenuCategoryDto = {
        name: "Test Category",
        menuId: "1",
      };
      const result = {
        id: "1",
        ...createMenuCategoryDto,
      };
      jest
        .spyOn(menuAdminService, "createCategory")
        .mockResolvedValue(result as unknown as MenuCategory);

      const createdCategory = await menuAdminController.createCategory(createMenuCategoryDto);

      expect(createdCategory).toBe(result);
      expect(menuAdminService.createCategory).toHaveBeenCalledWith(createMenuCategoryDto);
    });

    it("should throw an InternalServerErrorException when service throws an error", async () => {
      const createMenuCategoryDto: CreateMenuCategoryDto = {
        name: "Test Category",
        menuId: "1",
      };
      jest.spyOn(menuAdminService, "createCategory").mockRejectedValue(new Error("Service error"));

      await expect(menuAdminController.createCategory(createMenuCategoryDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe("updateCategory", () => {
    it("should update a menu category by id", async () => {
      const categoryId = "1";
      const updateMenuCategoryDto: UpdateMenuCategoryDto = {
        name: "Updated Category",
        menuId: "",
      };
      const result = {
        id: categoryId,
        ...updateMenuCategoryDto,
      };
      jest
        .spyOn(menuAdminService, "updateCategory")
        .mockResolvedValue(result as unknown as MenuCategory);

      const updatedCategory = await menuAdminController.updateCategory(
        categoryId,
        updateMenuCategoryDto,
      );

      expect(updatedCategory).toBe(result);
      expect(menuAdminService.updateCategory).toHaveBeenCalledWith(
        categoryId,
        updateMenuCategoryDto,
      );
    });

    it("should throw an InternalServerErrorException when service throws an error", async () => {
      const categoryId = "1";
      const updateMenuCategoryDto: UpdateMenuCategoryDto = {
        name: "Updated Category",
        menuId: "",
      };
      jest.spyOn(menuAdminService, "updateCategory").mockRejectedValue(new Error("Service error"));

      await expect(
        menuAdminController.updateCategory(categoryId, updateMenuCategoryDto),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe("deleteCategory", () => {
    it("should delete a menu category by id", async () => {
      const categoryId = "1";

      jest.spyOn(menuAdminService, "deleteCategory").mockResolvedValue(undefined);

      await menuAdminController.deleteCategory(categoryId);

      expect(menuAdminService.deleteCategory).toHaveBeenCalledWith(categoryId);
    });

    it("should throw an InternalServerErrorException when service throws an error", async () => {
      const categoryId = "1";
      jest.spyOn(menuAdminService, "deleteCategory").mockRejectedValue(new Error("Service error"));

      await expect(menuAdminController.deleteCategory(categoryId)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe("createPosition", () => {
    const createMenuPositionDto: CreateMenuPositionDto = {
      name: "Test Position",
      price: 10.99,
      menuCategoryId: "category-id",
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false,
    };

    it("should create a new menu position", async () => {
      const result = {
        id: "1",
        ...createMenuPositionDto,
      };
      jest
        .spyOn(menuAdminService, "createPosition")
        .mockResolvedValue(result as unknown as MenuPosition);

      const createdPosition = await menuAdminController.createPosition(createMenuPositionDto);

      expect(createdPosition).toBe(result);
      expect(menuAdminService.createPosition).toHaveBeenCalledWith(createMenuPositionDto);
    });

    it("should throw an InternalServerErrorException when service throws an error", async () => {
      jest.spyOn(menuAdminService, "createPosition").mockRejectedValue(new Error("Service error"));

      await expect(menuAdminController.createPosition(createMenuPositionDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe("updatePosition", () => {
    const updateMenuPositionDto: UpdateMenuPositionDto = {
      name: "Updated Position",
      price: 0,
      menuCategoryId: "",
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false,
    };
    it("should update a menu position by id", async () => {
      const positionId = "1";

      const result = {
        id: positionId,
        ...updateMenuPositionDto,
      };
      jest
        .spyOn(menuAdminService, "updatePosition")
        .mockResolvedValue(result as unknown as MenuPosition);

      const updatedPosition = await menuAdminController.updatePosition(
        positionId,
        updateMenuPositionDto,
      );

      expect(updatedPosition).toBe(result);
      expect(menuAdminService.updatePosition).toHaveBeenCalledWith(
        positionId,
        updateMenuPositionDto,
      );
    });

    it("should throw an InternalServerErrorException when service throws an error", async () => {
      const positionId = "1";

      jest.spyOn(menuAdminService, "updatePosition").mockRejectedValue(new Error("Service error"));

      await expect(
        menuAdminController.updatePosition(positionId, updateMenuPositionDto),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe("deletePosition", () => {
    it("should delete a menu position by id", async () => {
      const positionId = "1";

      jest.spyOn(menuAdminService, "deletePosition").mockResolvedValue(undefined);

      await menuAdminController.deletePosition(positionId);

      expect(menuAdminService.deletePosition).toHaveBeenCalledWith(positionId);
    });

    it("should throw an InternalServerErrorException when service throws an error", async () => {
      const positionId = "1";
      jest.spyOn(menuAdminService, "deletePosition").mockRejectedValue(new Error("Service error"));

      await expect(menuAdminController.deletePosition(positionId)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
