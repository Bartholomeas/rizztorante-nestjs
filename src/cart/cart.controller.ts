import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Session,
  ValidationPipe,
} from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { GuestEventTypes } from "@/auth/events/auth.events";
import { GuestSessionCreatedEvent } from "@/auth/events/guest-created.event";
import { SessionContent } from "@/auth/sessions/types/session.types";
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

  @Post("item")
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

  @Put("item/:cartItemId")
  @ApiOperation({ summary: "Set item quantity" })
  async setItemQuantity(
    @Session()
    session: SessionContent,
    @Param("cartItemId", new ParseUUIDPipe()) cartItemId: string,
    @Body(ValidationPipe) changeCartItemQuantityDto: ChangeCartItemQuantityDto,
  ) {
    try {
      if (!session?.passport?.user) {
        const guestCreatedEvent: GuestSessionCreatedEvent = {
          type: GuestEventTypes.SESSION_CREATED,
          payload: session,
        };

        await this.eventEmitter.emitAsync(guestCreatedEvent.type, guestCreatedEvent.payload);
      }

      return this.cartService.setQuantity(
        session?.passport?.user?.id,
        cartItemId,
        changeCartItemQuantityDto,
      );
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(err?.message);
    }
  }

  @Delete("item/:cartItemId")
  @ApiOperation({ summary: "Remove item from cart" })
  async removeItem(
    @Session()
    session: SessionContent,
    @Param("cartItemId", new ParseUUIDPipe()) cartItemId: string,
  ) {
    try {
      if (!session?.passport?.user) {
        const guestCreatedEvent: GuestSessionCreatedEvent = {
          type: GuestEventTypes.SESSION_CREATED,
          payload: session,
        };

        await this.eventEmitter.emitAsync(guestCreatedEvent.type, guestCreatedEvent.payload);
      }

      return this.cartService.removeItem(session.passport.user.id, cartItemId);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(err?.message);
    }
  }

  @Post("checkout")
  @ApiOperation({ summary: "Proceed to checkout" })
  async proceedToCheckout(@Session() session: SessionContent) {
    try {
      return await this.cartService.checkout(session.passport.user.id);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(err?.message);
    }
  }
}
