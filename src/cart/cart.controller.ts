import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Post,
  Put,
  Session,
  ValidationPipe,
} from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { GuestEventTypes, GuestSessionCreatedEvent } from "@/shared/events/guest-created.event";

import { SessionContent } from "@/auth/session/types/session.types";
import { AddCartItemDto } from "@/cart/dto/add-cart-item.dto";

import { CartService } from "./cart.service";
import { ChangeCartItemQuantityDto } from "./dto/change-cart-item-quantity.dto";

@Controller("cart")
@ApiTags("Cart")
export class CartController {
  constructor(
    private readonly cartService: CartService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Get()
  @ApiOperation({ summary: "Get cart" })
  async getCart(
    @Session()
    session: SessionContent,
  ) {
    try {
      if (!session?.passport?.user) {
        const guestCreatedEvent: GuestSessionCreatedEvent = {
          type: GuestEventTypes.SESSION_CREATED,
          payload: session,
        };

        await this.eventEmitter.emitAsync(guestCreatedEvent.type, guestCreatedEvent.payload);
      }

      return this.cartService.getUserCart(session.passport.user.id);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(err?.message);
    }
  }

  @Post("add-item")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Add item to cart" })
  async addItem(
    @Session()
    session: SessionContent,
    @Body(ValidationPipe) addCartItemDto: AddCartItemDto,
  ) {
    try {
      if (!session?.passport?.user) {
        const guestCreatedEvent: GuestSessionCreatedEvent = {
          type: GuestEventTypes.SESSION_CREATED,
          payload: session,
        };

        await this.eventEmitter.emitAsync(guestCreatedEvent.type, guestCreatedEvent.payload);
      }

      return await this.cartService.addItem(session.passport?.user?.id, addCartItemDto);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(err?.message);
    }
  }

  @Put("set-item-quantity")
  @ApiOperation({ summary: "Set item quantity" })
  async setItemQuantity(
    @Session()
    session: SessionContent,
    @Body(ValidationPipe) changeCartItemQuantityDto: ChangeCartItemQuantityDto,
  ) {
    try {
      return this.cartService.setQuantity(session?.passport?.user?.id, changeCartItemQuantityDto);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(err?.message);
    }
  }

  @Delete("remove-item")
  @ApiOperation({ summary: "Remove item from cart" })
  async removeItem(
    @Session()
    session: SessionContent,
  ) {
    try {
      if (!session?.passport?.user)
        throw new NotFoundException("User session not found. Item cannot be removed from cart.");

      console.log("Session in removeItemFromCart: ", session);

      return this.cartService.removeItem(session.passport.user.id, "itemId");
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(err?.message);
    }
  }

  @Post("checkout")
  @ApiOperation({ summary: "Proceed to checkout" })
  async proceedToCheckout(@Session() session: SessionContent) {
    try {
      return await this.cartService.proceedToCheckout(session.passport.user.id);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(err?.message);
    }
  }
}
