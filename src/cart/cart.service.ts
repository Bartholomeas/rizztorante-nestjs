import { Injectable, NotFoundException } from "@nestjs/common";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { InjectRepository } from "@nestjs/typeorm";

import { FindOneOptions, Repository } from "typeorm";

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
import { CartItemConfigurableIngredient } from "./entities/cart-item-configurable-ingredient.entity";
import { CartItemCustomConfig } from "./entities/cart-item-custom-config.entity";

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(CartItemConfigurableIngredient)
    private readonly cartItemConfigurableIngredientRepository: Repository<CartItemConfigurableIngredient>,

    @InjectRepository(CartItemCustomConfig)
    private readonly cartItemCustomConfigRepository: Repository<CartItemCustomConfig>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @OnEvent(CartEventTypes.GET_USER_CART)
  async getUserCart(userId: string): Promise<CartDto> {
    // const userCart = await this.retrieveUserCart(userId, opts);
    const userCart = await this.retrieveUserCart(userId, {
      relations: [
        "items",
        "items.menuPosition",
        "items.menuPosition.coreImage",
        "items.config",
        "items.config.configurableIngredient",
      ],
    });
    if (userCart) return new CartDto(userCart);

    const currentUser = await this.userRepository.findOne({ where: { id: userId } });
    if (!currentUser) throw new NotFoundException(`User with id ${userId} not found`);

    return await this.initUserCart(currentUser);
  }

  async addToCart(userId: string, addCartItemDto: AddCartItemDto): Promise<CartItemDto> {
    const userCart = await this.getUserCart(userId);

    const [menuPosition]: MenuPosition[] = await this.eventEmitter.emitAsync(
      ...getSinglePositionEvent(addCartItemDto.menuPositionId),
    );

    if (!menuPosition)
      throw new NotFoundException(
        `Menu position with id ${addCartItemDto.menuPositionId} not found`,
      );

    // const existingCartItem = userCart.items?.find(
    //   (item) => item.menuPosition?.id === menuPosition?.id,
    // );
    const existingCartItem = undefined;
    if (existingCartItem) {
      existingCartItem.quantity += addCartItemDto.quantity;
      existingCartItem.amount = menuPosition.price * existingCartItem.quantity;
    } else {
      const newCartItem = new CartItem();
      newCartItem.quantity = addCartItemDto.quantity;
      if (menuPosition.price) newCartItem.amount = menuPosition.price * addCartItemDto.quantity;
      newCartItem.menuPosition = menuPosition;

      if (addCartItemDto.configurableIngredients?.length > 0) {
        const cartItemConfig = new CartItemCustomConfig();
        cartItemConfig.cartItem = newCartItem;

        const configurableIngredients = addCartItemDto.configurableIngredients.map((ingredient) => {
          const cartItemConfigurableIngredient = new CartItemConfigurableIngredient();
          cartItemConfigurableIngredient.id = ingredient.id;
          cartItemConfigurableIngredient.quantity = ingredient.quantity ?? 1;
          return cartItemConfigurableIngredient;
        });

        await this.cartItemConfigurableIngredientRepository.save(configurableIngredients);

        cartItemConfig.configurableIngredient = configurableIngredients;
        await this.cartItemCustomConfigRepository.save(cartItemConfig);
        newCartItem.config = cartItemConfig;
      }

      userCart.items.push(new CartItemDto(newCartItem));
    }

    userCart.total = userCart.items.reduce((total, item) => total + item.amount, 0);

    await this.cartRepository.save(userCart);

    return existingCartItem;
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

    await this.cartRepository.save(cart);
    return cart;
  }

  async removeItem(userId: string, itemId: string): Promise<CartDto> {
    const cart = await this.getUserCart(userId);
    const itemIndex = cart?.items?.findIndex((item) => item.id === itemId);

    if (itemIndex === -1)
      throw new NotFoundException(`Item with id ${itemId} not found in the cart`);

    const [removedItem] = cart.items.splice(itemIndex, 1);
    cart.total -= removedItem.amount;

    await this.cartItemRepository.remove(removedItem as CartItem);
    await this.cartRepository.save(cart);
    return cart;
  }

  private async initUserCart(user: User): Promise<CartDto> {
    const createdCart = this.cartRepository.create({ user, items: [], total: 0 } as Partial<Cart>);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { user: _, ...rest } = await this.cartRepository.save(createdCart);
    return new CartDto(rest);
  }

  private async retrieveUserCart(
    userId: string,
    opts?: FindOneOptions<Cart>,
  ): Promise<Cart | null> {
    return this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ["items", "items.menuPosition", "items.menuPosition.coreImage"],
      ...opts,
    });
  }

  private calculateItemAmount(item: CartItemDto): number {
    return Number(item.menuPosition.price * item.quantity);
  }
}
