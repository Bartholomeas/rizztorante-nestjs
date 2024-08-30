import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { MenuAdminService } from "./menu-admin.service";
import { MenuCategory } from "../entity/menu-category.entity";
import { MenuPosition } from "../entity/menu-position.entity";
import { Menu } from "../entity/menu.entity";
import { CreateMenuDto } from "./dto/create/create-menu.dto";

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<unknown>;
};

// const menuArray = [
//   {
//     id: "0488614e-ea81-4211-9caf-fb84f620a33f",
//     name: "Italian Pizzas",
//     description: "Italian flavored Pizzas",
//     slug: "italian-pizzas",
//   },
//   {
//     id: "0488614e-ea81-4211-9caf-fb84f620a3df",
//     name: "Burgers Yum",
//     description: "Juicy burgers",
//     slug: "burgers-yum",
//   },
// ];

// const oneMenu = {
//   id: "0488614e-ea81-4211-9caf-fb84f620a3dc",
//   name: "Pizzas",
//   description: "Italian flavored Pizzas",
//   slug: "pizzas",
// };
describe("MenuAdminService", () => {
  let service: MenuAdminService;
  let menuRepository: Repository<Menu>;
  // let menuCategoryRepository: Repository<MenuCategory>;
  // let menuPositionRepository: Repository<MenuPosition>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MenuAdminService,
        {
          provide: getRepositoryToken(Menu),

          useClass: Repository,
          // useValue: {
          //   create: jest.fn().mockReturnValue(oneMenu),
          //   save: jest.fn().mockResolvedValue(oneMenu),
          //   find: jest.fn().mockResolvedValue(menuArray),
          //   findOne: jest.fn().mockResolvedValue(oneMenu),
          //   update: jest.fn().mockResolvedValue(oneMenu),
          //   delete: jest.fn(),
          //   count: jest.fn(),
          // },
        },
        {
          provide: getRepositoryToken(MenuCategory),
          useClass: Repository,
          // useValue: {
          //   create: jest.fn(),
          //   save: jest.fn(),
          //   find: jest.fn(),
          //   findOne: jest.fn(),
          //   update: jest.fn(),
          //   delete: jest.fn(),
          // },
        },
        {
          provide: getRepositoryToken(MenuPosition),
          useClass: Repository,
          // useValue: {
          //   create: jest.fn(),
          //   save: jest.fn(),
          //   find: jest.fn(),
          //   findOne: jest.fn(),
          //   update: jest.fn(),
          //   delete: jest.fn(),
          // },
        },
      ],
    }).compile();

    service = module.get<MenuAdminService>(MenuAdminService);
    menuRepository = module.get<Repository<Menu>>(getRepositoryToken(Menu));
    // menuCategoryRepository = module.get<Repository<MenuCategory>>(getRepositoryToken(MenuCategory));
    // menuPositionRepository = module.get<Repository<MenuPosition>>(getRepositoryToken(MenuPosition));
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it("should create a new menu with unique slug", async () => {
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
      jest.spyOn(menuRepository, "count").mockResolvedValue(0);
      jest.spyOn(menuRepository, "create").mockReturnValue({
        ...createdMenu,
        description: createMenuDto.description,
      });
      jest.spyOn(menuRepository, "save").mockResolvedValue({
        ...createdMenu,
        description: createMenuDto.description,
      });

      const result = await service.createMenu(createMenuDto);

      expect(menuRepository.create).toHaveBeenCalledWith({
        ...createMenuDto,
        slug: "pizzas",
      });
      expect(result).toHaveProperty("id");
    });
  });
});
