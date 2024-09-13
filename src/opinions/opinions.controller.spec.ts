import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";

import { Repository } from "typeorm";

import { Opinion } from "./entities/opinion.entity";
import { OpinionsController } from "./opinions.controller";
import { OpinionsService } from "./opinions.service";

describe("OpinionsController", () => {
  let controller: OpinionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OpinionsController],
      providers: [
        OpinionsService,
        {
          provide: getRepositoryToken(Opinion),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<OpinionsController>(OpinionsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
