import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { OperatingHours } from "./entities/operating-hours.entity";
import { SpecialDate } from "./entities/special-dates.entity";
import { RestaurantConfigController } from "./restaurant-config.controller";
import { RestaurantConfigService } from "./restaurant-config.service";

describe("RestaurantConfigController", () => {
  let controller: RestaurantConfigController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RestaurantConfigController],
      providers: [
        RestaurantConfigService,

        {
          provide: getRepositoryToken(OperatingHours),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(SpecialDate),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<RestaurantConfigController>(RestaurantConfigController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
