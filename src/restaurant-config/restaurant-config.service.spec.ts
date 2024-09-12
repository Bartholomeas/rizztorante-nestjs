import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";

import { RestaurantConfigService } from "./restaurant-config.service";

describe("RestaurantConfigService", () => {
  let service: RestaurantConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RestaurantConfigService],
    }).compile();

    service = module.get<RestaurantConfigService>(RestaurantConfigService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
