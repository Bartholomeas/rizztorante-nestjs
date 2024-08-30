import { Test, TestingModule } from "@nestjs/testing";

import { MenuAdminService } from "./menu-admin.service";

describe("MenuAdminService", () => {
  let service: MenuAdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MenuAdminService],
    }).compile();

    service = module.get<MenuAdminService>(MenuAdminService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
