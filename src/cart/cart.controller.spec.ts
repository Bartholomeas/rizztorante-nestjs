import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";

import { Repository } from "typeorm";

import { User } from "@/auth/entity/user.entity";
import { SessionEntity } from "@/auth/session/entity/session.entity";
import { CartItem } from "@/cart/entity/cart-item.entity";
import { Cart } from "@/cart/entity/cart.entity";

import { CartController } from "./cart.controller";
import { CartService } from "./cart.service";

describe("CartController", () => {
  let controller: CartController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        CartService,

        {
          provide: getRepositoryToken(Cart),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(CartItem),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(SessionEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<CartController>(CartController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
