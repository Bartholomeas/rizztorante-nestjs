import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";

import { STRIPE_KEY } from "@app/restaurant/payments/stripe/stripe.constants";

import { StripeService } from "./stripe.service";

describe("StripeService", () => {
  let service: StripeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StripeService,
        {
          provide: STRIPE_KEY,
          useValue: "test_stripe_key",
        },
      ],
    }).compile();

    service = module.get<StripeService>(StripeService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
