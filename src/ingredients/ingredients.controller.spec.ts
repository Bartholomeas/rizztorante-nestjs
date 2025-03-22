import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ConfigurableIngredient } from "@/ingredients/ingredients-config/entities/configurable-ingredient.entity";
import { IngredientsConfig } from "@/ingredients/ingredients-config/entities/ingredients-config.entity";

import { Ingredient } from "./entities/ingredient.entity";
import { IngredientsController } from "./ingredients.controller";
import { IngredientsService } from "./ingredients.service";

describe("IngredientsController", () => {
  let controller: IngredientsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngredientsController],
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
          provide: getRepositoryToken(ConfigurableIngredient),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<IngredientsController>(IngredientsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
