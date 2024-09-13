import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";

import { Repository } from "typeorm";

import { Opinion } from "./entities/opinion.entity";
import { OpinionsService } from "./opinions.service";

describe("OpinionsService", () => {
  let service: OpinionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OpinionsService,
        {
          provide: getRepositoryToken(Opinion),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<OpinionsService>(OpinionsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
