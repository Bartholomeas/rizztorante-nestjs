import { Injectable, NotFoundException } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";

import { GetSinglePositionEvent, MenuPublicEventTypes } from "@/shared/events/menu-public.events";

import { User } from "@/auth/entity/user.entity";
import { AddCartItemDto } from "@/cart/dto/add-cart-item.dto";
import { MenuPosition } from "@/menu/entity/menu-position.entity";

import { CartItem } from "./entity/cart-item.entity";
import { Cart } from "./entity/cart.entity";

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async getUserCart(userId: string): Promise<Cart> {
    const userCart = await this.retrieveUserCart(userId);
    if (userCart) return userCart;

    const currentUser = await this.userRepository.findOne({ where: { id: userId } });
    if (!currentUser) throw new NotFoundException(`User with id ${userId} not found`);

    return this.initUserCart(currentUser);
  }
  async addItem(userId: string, addCartItemDto: AddCartItemDto): Promise<Cart> {
    const userCart = await this.getUserCart(userId);
    const menuPositionEvent: GetSinglePositionEvent = {
      type: MenuPublicEventTypes.GET_SINGLE_POSITION,
      payload: addCartItemDto?.menuPositionId,
    };

    const [menuPosition]: MenuPosition[] = await this.eventEmitter.emitAsync(
      menuPositionEvent.type,
      menuPositionEvent.payload,
    );

    if (!menuPosition)
      throw new NotFoundException(
        `Menu position with id ${addCartItemDto.menuPositionId} not found`,
      );

    const existingCartItem = userCart.items.find(
      (item) => item.menuPosition.id === menuPosition.id,
    );

    if (existingCartItem) {
      existingCartItem.quantity += addCartItemDto.quantity;
      existingCartItem.amount = menuPosition.price * existingCartItem.quantity;
    } else {
      const newCartItem = new CartItem();
      newCartItem.quantity = addCartItemDto.quantity;
      if (menuPosition.price) newCartItem.amount = menuPosition.price * addCartItemDto.quantity;
      newCartItem.menuPosition = menuPosition;
      userCart.items.push(newCartItem);
    }

    userCart.total = userCart.items.reduce((total, item) => total + item.amount, 0);

    return await this.cartRepository.save(userCart);
  }

  async setQuantity(userId: string, cartItemId: string, quantity: number): Promise<Cart> {
    const cart = await this.getUserCart(userId);
    const item = cart.items.find((item) => item.id === cartItemId);

    if (!item) throw new NotFoundException(`Item with id ${cartItemId} not found in the cart`);

    const oldAmount = item.amount;
    item.quantity = quantity;
    item.amount = item.menuPosition.price * quantity;

    cart.total = cart.total - oldAmount + item.amount;

    return this.cartRepository.save(cart);
  }

  async removeItem(userId: string, itemId: string): Promise<Cart> {
    const cart = await this.getUserCart(userId);
    const itemIndex = cart.items.findIndex((item) => item.id === itemId);

    if (itemIndex === -1)
      throw new NotFoundException(`Item with id ${itemId} not found in the cart`);

    const [removedItem] = cart.items.splice(itemIndex, 1);
    cart.total -= removedItem.amount;

    await this.cartItemRepository.remove(removedItem);
    return this.cartRepository.save(cart);
  }

  async proceedToCheckout(userId: string): Promise<void> {
    console.log("userId", userId);
    throw new Error("Checkout process not implemented");
  }

  private async initUserCart(user: User): Promise<Cart> {
    const createdCart = this.cartRepository.create({ user, items: [], total: 0 });
    return this.cartRepository.save(createdCart);
  }

  private async retrieveUserCart(userId: string): Promise<Cart | null> {
    return this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ["items", "items.menuPosition"],
      select: { user: { id: true } },
      cache: {
        id: `${userId}-user-cart`,
        milliseconds: 1000 * 60 * 5,
      },
    });
  }
}
