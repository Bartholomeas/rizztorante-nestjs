import { Test, TestingModule } from "@nestjs/testing";

import { MenuPublicService } from "./menu-public.service";

describe("MenuPublicService", () => {
  let service: MenuPublicService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MenuPublicService],
    }).compile();

    service = module.get<MenuPublicService>(MenuPublicService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
