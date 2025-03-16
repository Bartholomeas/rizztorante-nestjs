import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";

import { CartEventTypes } from "@events/events";
import { getSinglePositionEvent } from "@events/payloads";
import { findConfigurableIngredientsEvent } from "@events/payloads/ingredients";

import { AddCartItemDto } from "@/cart/dto/add-cart-item.dto";
import { CartItem } from "@/cart/entities/cart-item.entity";
import { ConfigurableIngredient } from "@/ingredients/ingredients-config/entities/configurable-ingredient.entity";
import { MenuPosition } from "@/menu/entities/menu-position.entity";
import { User } from "@/users/entities/user.entity";

import { CartItemDto } from "./dto/cart-item.dto";
import { CartDto } from "./dto/cart.dto";
import { ChangeCartItemQuantityDto } from "./dto/change-cart-item-quantity.dto";
import { CreateCartItemConfigurableIngredientDto } from "./dto/create-cart-item-configurable-ingredient.dto";
import { CartItemConfigurableIngredient } from "./entities/cart-item-configurable-ingredient.entity";
import { CART_REPOSITORY_DI, CartRepository } from "./repositories/cart.repository";
import { USER_REPOSITORY_DI, UserRepository } from "@/users/repositories/user.repository";

@Injectable()
export class CartService {
  private readonly logger = new Logger(CartService.name);

  constructor(
    @Inject(CART_REPOSITORY_DI)
    private readonly cartRepository: CartRepository,
    @Inject(USER_REPOSITORY_DI)
    private readonly userRepository: UserRepository,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(CartItemConfigurableIngredient)
    private readonly cartItemConfigurableIngredientRepository: Repository<CartItemConfigurableIngredient>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @OnEvent(CartEventTypes.GET_USER_CART)
  async getUserCart(userId: string): Promise<CartDto> {
    const userCart = await this.cartRepository.findCartByUserId(userId);
    if (userCart) return new CartDto(userCart);

    const currentUser = await this.userRepository.findUserById(userId);
    if (!currentUser) throw new NotFoundException(`User with id ${userId} not found`);

    return await this.initUserCart(currentUser);
  }

  async addToCart(userId: string, addCartItemDto: AddCartItemDto): Promise<CartItemDto[]> {
    const userCart = await this.getUserCart(userId);

    const [menuPosition]: MenuPosition[] = await this.eventEmitter.emitAsync(
      ...getSinglePositionEvent(addCartItemDto.menuPositionId),
    );

    if (!menuPosition)
      throw new NotFoundException(
        `Menu position with id ${addCartItemDto.menuPositionId} not found`,
      );

    const existingCartItem = this.checkIfItemExists(userCart, menuPosition, addCartItemDto);

    if (existingCartItem) {
      this.updateExistingCartItem(existingCartItem, menuPosition, addCartItemDto);
    } else {
      const newCartItem = await this.createNewCartItem(menuPosition, addCartItemDto);
      userCart.items.push(new CartItemDto(newCartItem));
    }

    userCart.total = this.calculateCartTotal(userCart);

    await this.cartRepository.save(userCart);
    return userCart.items;
  }

  async setQuantity(
    userId: string,
    cartItemId,
    { quantity }: ChangeCartItemQuantityDto,
  ): Promise<CartDto> {
    const cart = await this.getUserCart(userId);
    const item = cart?.items?.find((item) => item.id === cartItemId);

    if (!item) throw new NotFoundException(`This item not found in the cart. Try again.`);

    const oldAmount = item?.amount;

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
      throw new NotFoundException(`This item not found in the cart. Try again.`);

    const [removedItem] = cart.items.splice(itemIndex, 1);
    cart.total -= removedItem.amount;

    await this.cartItemRepository.remove(removedItem as unknown as CartItem);
    await this.cartRepository.save(cart);
    return cart;
  }

  private async initUserCart(user: User): Promise<CartDto> {
    if (!user || !user.id) {
      throw new BadRequestException("Invalid user provided for cart initialization");
    }

    const createdCart = this.cartRepository.create({
      user: { id: user.id },
      items: [],
      total: 0,
    });

    const savedCart = await this.cartRepository.save(createdCart);
    return new CartDto(savedCart);
  }

  private updateExistingCartItem(
    existingCartItem: CartItemDto,
    menuPosition: MenuPosition,
    addCartItemDto: AddCartItemDto,
  ) {
    existingCartItem.quantity += addCartItemDto.quantity;
    existingCartItem.amount = menuPosition.price * existingCartItem.quantity;
  }

  private calculateCartTotal(userCart: CartDto): number {
    return userCart.items.reduce((total, item) => total + item.amount, 0);
  }

  private checkIfItemExists(
    userCart: CartDto,
    menuPosition: MenuPosition,
    addCartItemDto: AddCartItemDto,
  ): CartItemDto | null {
    return (
      userCart.items.find((item) => {
        const isSameMenuPosition = item.menuPosition?.id === menuPosition?.id;
        const hasIngredients = item.ingredients?.length;
        const hasConfigurableIngredients = addCartItemDto.configurableIngredients?.length > 0;

        if (hasConfigurableIngredients) {
          const lengthsMatch =
            addCartItemDto.configurableIngredients.length === item.ingredients.length;
          const ingredientsMatch = item.ingredients.every((ing) =>
            addCartItemDto.configurableIngredients.some(
              (configIng) => configIng.id === ing.configurableIngredient.id,
            ),
          );

          return isSameMenuPosition && ingredientsMatch && lengthsMatch;
        }

        return isSameMenuPosition && !hasIngredients;
      }) || null
    );
  }

  private calculateItemAmount(item: CartItemDto): number {
    return Number(item.menuPosition.price * item.quantity);
  }

  private async createNewCartItem(menuPosition: MenuPosition, addCartItemDto: AddCartItemDto) {
    const newCartItem = new CartItem();
    newCartItem.quantity = addCartItemDto.quantity;

    if (menuPosition?.price)
      newCartItem.amount = this.calculateAmount(menuPosition.price, addCartItemDto.quantity);

    newCartItem.menuPosition = menuPosition;

    if (addCartItemDto.configurableIngredients?.length > 0) {
      const configurableIngredients = await this.createConfigurableIngredients(
        newCartItem,
        addCartItemDto.configurableIngredients,
      );

      newCartItem.ingredients = configurableIngredients;
      await this.cartItemConfigurableIngredientRepository.save(configurableIngredients);
    }

    return newCartItem;
  }

  private async createConfigurableIngredients(
    newCartItem: CartItem,
    ingredientsDto: CreateCartItemConfigurableIngredientDto[],
  ): Promise<CartItemConfigurableIngredient[]> {
    const configurableIngredientIds = ingredientsDto.map((ing) => ing.id);
    const [configurableIngredients] = (await this.eventEmitter.emitAsync(
      ...findConfigurableIngredientsEvent({ configurableIngredientId: configurableIngredientIds }),
    )) as ConfigurableIngredient[][];

    const ingredients = ingredientsDto.map((ing) => {
      const configurableIngredient = configurableIngredients.find((ci) => ci.id === ing.id);
      if (!configurableIngredient)
        throw new NotFoundException(`Configurable ingredient with id ${ing.id} not found`);

      const ingredient = new CartItemConfigurableIngredient();
      ingredient.quantity = ing.quantity ?? 1;
      ingredient.cartItem = newCartItem;
      ingredient.configurableIngredient = configurableIngredient;
      return ingredient;
    });

    await this.cartItemConfigurableIngredientRepository.save(ingredients);

    return ingredients;
  }

  private calculateAmount(price: number, quatity: number): number {
    return price * quatity;
  }
}
