import { Test, TestingModule } from "@nestjs/testing";

import { MenuAdminController } from "./menu-admin.controller";

describe("MenuAdminController", () => {
  let controller: MenuAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MenuAdminController],
    }).compile();

    controller = module.get<MenuAdminController>(MenuAdminController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
