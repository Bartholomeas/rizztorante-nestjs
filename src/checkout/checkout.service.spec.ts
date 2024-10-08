import { EventEmitter2 } from "@nestjs/event-emitter";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";

import { CheckoutService } from "./checkout.service";

describe("CheckoutService", () => {
  let service: CheckoutService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CheckoutService, EventEmitter2],
    }).compile();

    service = module.get<CheckoutService>(CheckoutService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
