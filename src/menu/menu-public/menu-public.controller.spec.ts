import { Test, TestingModule } from "@nestjs/testing";

import { MenuPublicController } from "./menu-public.controller";

describe("MenuPublicController", () => {
  let controller: MenuPublicController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MenuPublicController],
    }).compile();

    controller = module.get<MenuPublicController>(MenuPublicController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
