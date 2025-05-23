import { NotFoundException } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { SessionEntity } from "@/auth/sessions/entity/session.entity";
import { CartItem } from "@/cart/entities/cart-item.entity";
import { Cart } from "@/cart/entities/cart.entity";
import type { MenuPosition } from "@/menu/entities/menu-position.entity";
import { User } from "@/users/entities/user.entity";

import { CartService } from "./cart.service";
import { CartDto } from "./dto/cart.dto";
import { CartItemConfigurableIngredient } from "./entities/cart-item-configurable-ingredient.entity";

jest.mock("@events/events");

describe("CartService", () => {
  let service: CartService;
  // let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const mockEventEmitter = {
      emit: jest.fn(),
      emitAsync: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
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
          useValue: mockEventEmitter,
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
    // eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
  it("should initialize a new cart for a user if no cart exists", async () => {
    const userId = "test-user-id";
    const user = { id: userId } as User;
    const cartItem = { id: "itemId", amount: 10 } as CartItem;
    const userCart = { items: [cartItem], total: 10, user } as Cart;
    jest.spyOn(service, "getUserCart").mockResolvedValue(new CartDto(userCart));
    jest.spyOn(service["userRepository"], "findOne").mockResolvedValue(user);
    jest.spyOn(service["cartRepository"], "save").mockResolvedValue(userCart);

    const result = await service.getUserCart(userId);
    expect(result).toBeDefined();
    expect(result).toEqual(userCart);
    expect(result.items).toEqual([cartItem]);
    expect(result.total).toBe(10);
  });

  it("should add a new item to the cart", async () => {
    const userId = "test-user-id";
    const addCartItemDto = { menuPositionId: "test-menu-position-id", quantity: 1 };
    const userCart = { items: [], total: 0 } as Cart;
    const menuPosition = { id: "test-menu-position-id", price: 10 } as MenuPosition;
    jest.spyOn(service, "getUserCart").mockResolvedValue(new CartDto(userCart));
    jest.spyOn(service["eventEmitter"], "emitAsync").mockResolvedValue([menuPosition]);
    jest.spyOn(service["cartRepository"], "save").mockResolvedValue(userCart);

    await service.addToCart(userId, addCartItemDto);

    const updatedCart = await service.getUserCart(userId);
    expect(updatedCart.items.length).toBe(1);
    expect(updatedCart.items[0].menuPosition.id).toBe(menuPosition.id);
    expect(updatedCart.items[0].quantity).toBe(addCartItemDto.quantity);
    expect(updatedCart.items[0].amount).toBe(menuPosition.price * addCartItemDto.quantity);
    expect(updatedCart.total).toBe(menuPosition.price * addCartItemDto.quantity);
  });

  it("should update the quantity of an existing item in the cart", async () => {
    const userId = "test-user-id";
    const addCartItemDto = { menuPositionId: "test-menu-position-id", quantity: 1 };
    const menuPosition = { id: "test-menu-position-id", price: 10 } as MenuPosition;
    const existingCartItem = { menuPosition, quantity: 1, amount: 10 } as CartItem;
    const userCart = { items: [existingCartItem], total: 10 } as Cart;
    jest.spyOn(service, "getUserCart").mockResolvedValue(new CartDto(userCart));
    jest.spyOn(service["eventEmitter"], "emitAsync").mockResolvedValue([menuPosition]);
    jest.spyOn(service["cartRepository"], "save").mockResolvedValue(userCart);

    await service.addToCart(userId, addCartItemDto);

    const updatedCart = await service.getUserCart(userId);
    expect(updatedCart.items.length).toBe(1);
    expect(updatedCart.items[0].menuPosition.id).toBe(menuPosition.id);
    expect(updatedCart.items[0].quantity).toBe(addCartItemDto.quantity + 1);
    expect(updatedCart.items[0].amount).toBe(menuPosition.price * (addCartItemDto.quantity + 1));
    expect(updatedCart.total).toBe(menuPosition.price * (addCartItemDto.quantity + 1));
  });

  it("should throw NotFoundException if menu position is not found", async () => {
    const userId = "test-user-id";
    const addCartItemDto = { menuPositionId: "non-existent-menu-position-id", quantity: 1 };
    const userCart = { items: [], total: 0 } as Cart;
    jest.spyOn(service, "getUserCart").mockResolvedValue(new CartDto(userCart));
    jest.spyOn(service["eventEmitter"], "emitAsync").mockResolvedValue([]);

    await expect(service.addToCart(userId, addCartItemDto)).rejects.toThrow(NotFoundException);
  });

  it("should remove an item from the cart", async () => {
    const userId = "test-user-id";
    const itemId = "test-item-id";
    const cartItem = { id: itemId, amount: 10 } as CartItem;
    const userCart = { items: [cartItem], total: 10 } as Cart;
    jest.spyOn(service, "getUserCart").mockResolvedValue(new CartDto(userCart));
    jest.spyOn(service["cartRepository"], "save").mockResolvedValue(userCart);
    jest.spyOn(service["cartItemRepository"], "remove").mockResolvedValue(cartItem);
    jest.spyOn(service["cartRepository"], "save").mockResolvedValue(userCart);

    const result = await service.removeItem(userId, itemId);

    expect(result.items.length).toBe(0);
    expect(result.total).toBe(0);
  });

  it("should throw NotFoundException if item to remove is not found", async () => {
    const userId = "test-user-id";
    const itemId = "non-existent-item-id";
    const userCart = { items: [], total: 0 } as Cart;
    jest.spyOn(service, "getUserCart").mockResolvedValue(new CartDto(userCart));

    await expect(service.removeItem(userId, itemId)).rejects.toThrow(NotFoundException);
  });

  it("should update the quantity of an item in the cart", async () => {
    const userId = "test-user-id";
    const cartItemId = "test-cart-item-id";
    const changeCartItemQuantityDto = { quantity: 2 };
    const menuPosition = { price: 10 } as MenuPosition;
    const cartItem = { id: cartItemId, quantity: 1, amount: 10, menuPosition } as CartItem;
    const userCart = { items: [cartItem], total: 10 } as Cart;
    jest.spyOn(service, "getUserCart").mockResolvedValue(new CartDto(userCart));
    jest.spyOn(service["cartRepository"], "save").mockResolvedValue(userCart);

    const result = await service.setQuantity(userId, cartItemId, changeCartItemQuantityDto);

    expect(result.items[0].quantity).toBe(2);
    expect(result.items[0].amount).toBe(20);
    expect(result.total).toBe(20);
  });

  it("should throw NotFoundException if item to update quantity is not found", async () => {
    const userId = "test-user-id";
    const cartItemId = "non-existent-cart-item-id";
    const changeCartItemQuantityDto = { quantity: 2 };
    const userCart = { items: [], total: 0 } as Cart;
    jest.spyOn(service, "getUserCart").mockResolvedValue(new CartDto(userCart));

    await expect(
      service.setQuantity(userId, cartItemId, changeCartItemQuantityDto),
    ).rejects.toThrow(NotFoundException);
  });

  // it("should throw an error when proceeding to checkout", async () => {
  //   const userId = "test-user-id";
  //   jest.spyOn(service["eventEmitter"], "emitAsync").mockRejectedValue([]);
  //
  //   await expect(service.checkout(userId)).toBe([]);
  // });
});
