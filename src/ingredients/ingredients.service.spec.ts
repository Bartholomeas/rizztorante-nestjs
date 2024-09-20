import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";

import { Repository } from "typeorm";

import { CustomIngredient } from "@/ingredients/ingredients-config/entities/custom-ingredient.entity";
import { IngredientsConfig } from "@/ingredients/ingredients-config/entities/ingredients-config.entity";

import { Ingredient } from "./entities/ingredient.entity";
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
          provide: getRepositoryToken(IngredientsConfig),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(CustomIngredient),
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
