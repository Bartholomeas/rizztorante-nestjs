import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";

import { Repository } from "typeorm";

import { Ingredient } from "./entities/ingredient.entity";
import { ConfigurableIngredient } from "./ingredients-configuration/entities/configurable-ingredient.entity";
import { IngredientsConfiguration } from "./ingredients-configuration/entities/ingredients-configuration.entity";
import { IngredientsService } from "./ingredients.service";

describe("IngredientsService", () => {
  let service: IngredientsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngredientsService,
        {
          provide: getRepositoryToken(Ingredient),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(IngredientsConfiguration),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(ConfigurableIngredient),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<IngredientsService>(IngredientsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
