import { EventEmitter2 } from "@nestjs/event-emitter";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";

import { CheckoutController } from "./checkout.controller";
import { CheckoutService } from "./checkout.service";

describe("CheckoutController", () => {
  let controller: CheckoutController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CheckoutController],
      providers: [CheckoutService, EventEmitter2],
    }).compile();

    controller = module.get<CheckoutController>(CheckoutController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
