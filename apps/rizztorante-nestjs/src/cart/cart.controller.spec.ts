import { EventEmitter2 } from "@nestjs/event-emitter";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";

import { SessionEntity } from "@app/restaurant/auth/sessions/entity/session.entity";
import { CartItem } from "@app/restaurant/cart/entities/cart-item.entity";
import { Cart } from "@app/restaurant/cart/entities/cart.entity";
import { User } from "@app/restaurant/users/entities/user.entity";
import { Repository } from "typeorm";

import { CartController } from "./cart.controller";
import { CartService } from "./cart.service";
import { CartItemConfigurableIngredient } from "./entities/cart-item-configurable-ingredient.entity";

describe("CartController", () => {
  let controller: CartController;
  let eventEmitter: EventEmitter2;

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
        {
          provide: getRepositoryToken(CartItemConfigurableIngredient),
          useClass: Repository,
        },
        {
          provide: EventEmitter2,
          useValue: eventEmitter,
        },
      ],
    }).compile();

    controller = module.get<CartController>(CartController);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
