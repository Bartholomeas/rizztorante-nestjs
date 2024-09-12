import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";

import { Repository } from "typeorm";

import { OperatingHours } from "./entities/operating-hours.entity";
import { RestaurantConfig } from "./entities/restaurant-config.entity";
import { SpecialDate } from "./entities/special-dates.entity";
import { RestaurantConfigService } from "./restaurant-config.service";

describe("RestaurantConfigService", () => {
  let service: RestaurantConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestaurantConfigService,
        {
          provide: getRepositoryToken(RestaurantConfig),
          useClass: Repository,
        },
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

    service = module.get<RestaurantConfigService>(RestaurantConfigService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
