import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";

import { RestaurantConfigController } from "./restaurant-config.controller";

describe("RestaurantConfigController", () => {
  let controller: RestaurantConfigController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RestaurantConfigController],
    }).compile();

    controller = module.get<RestaurantConfigController>(RestaurantConfigController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
