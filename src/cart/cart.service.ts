import { Injectable, NotFoundException } from "@nestjs/common";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";

import { CartEventTypes } from "@events/events";
import { getSinglePositionEvent } from "@events/payloads";

import { User } from "@/auth/entities/user.entity";
import { AddCartItemDto } from "@/cart/dto/add-cart-item.dto";
import { CartItem } from "@/cart/entities/cart-item.entity";
import { Cart } from "@/cart/entities/cart.entity";
import { MenuPosition } from "@/menu/entities/menu-position.entity";

import { CartItemDto } from "./dto/cart-item.dto";
import { CartDto } from "./dto/cart.dto";
import { ChangeCartItemQuantityDto } from "./dto/change-cart-item-quantity.dto";

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

  @OnEvent(CartEventTypes.GET_USER_CART)
  async getUserCart(userId: string): Promise<CartDto> {
    const userCart = await this.retrieveUserCart(userId);
    if (userCart) return new CartDto(userCart);

    const currentUser = await this.userRepository.findOne({ where: { id: userId } });
    if (!currentUser) throw new NotFoundException(`User with id ${userId} not found`);

    return this.initUserCart(currentUser);
  }

  async addItem(userId: string, addCartItemDto: AddCartItemDto): Promise<Cart> {
    const userCart = await this.getUserCart(userId);

    const [menuPosition]: MenuPosition[] = await this.eventEmitter.emitAsync(
      ...getSinglePositionEvent(addCartItemDto.menuPositionId),
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
      userCart.items.push(new CartItemDto(newCartItem));
    }

    userCart.total = userCart.items.reduce((total, item) => total + item.amount, 0);

    return await this.cartRepository.save(userCart);
  }

  async setQuantity(
    userId: string,
    cartItemId,
    { quantity }: ChangeCartItemQuantityDto,
  ): Promise<CartDto> {
    const cart = await this.getUserCart(userId);
    const item = cart?.items?.find((item) => item.id === cartItemId);

    if (!item) throw new NotFoundException(`Item with id ${cartItemId} not found in the cart`);

    const oldAmount = item.amount;

    item.quantity = quantity;
    item.amount = this.calculateItemAmount(item);

    cart.total = cart.total - oldAmount + item.amount;

    return this.cartRepository.save(cart);
  }

  async removeItem(userId: string, itemId: string): Promise<CartDto> {
    const cart = await this.getUserCart(userId);
    const itemIndex = cart?.items?.findIndex((item) => item.id === itemId);

    if (itemIndex === -1)
      throw new NotFoundException(`Item with id ${itemId} not found in the cart`);

    const [removedItem] = cart.items.splice(itemIndex, 1);
    cart.total -= removedItem.amount;

    await this.cartItemRepository.remove(removedItem as CartItem);
    return this.cartRepository.save(cart);
  }

  private async initUserCart(user: User): Promise<CartDto> {
    const createdCart = this.cartRepository.create({ user, items: [], total: 0 });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { user: _, ...rest } = await this.cartRepository.save(createdCart);
    return new CartDto(rest);
  }

  private async retrieveUserCart(userId: string): Promise<Cart | null> {
    return this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ["items", "items.menuPosition", "items.menuPosition.coreImage"],
      // select: { user: { id: true } },
      // cache: {
      //   id: `${userId}-user-cart`,
      //   milliseconds: 1000 * 60 * 5,
      // },
    });
  }

  private calculateItemAmount(item: CartItemDto): number {
    return Number(item.menuPosition.price * item.quantity);
  }
}
