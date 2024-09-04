import {
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
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { SessionContent } from "@/auth/session/types/session.types";

import { CartService } from "./cart.service";

@Controller("cart")
@ApiTags("Cart")
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: "Get cart" })
  async getCart(
    @Session()
    session: SessionContent,
  ) {
    try {
      if (!session?.passport?.user)
        throw new NotFoundException("User session not found. Cart cannot be returned.");

      console.log("Session in getCart: ", session);

      return this.cartService.getUserCart(session.passport.user.id);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(err?.message);
    }
  }

  @Post("add-item")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Add item to cart" })
  async addItemToCart(
    @Session()
    session: SessionContent,
  ) {
    try {
      if (!session?.passport?.user)
        throw new NotFoundException("User session not found. Item cannot be added to cart.");

      console.log("Session in addItemToCart: ", session);

      return this.cartService.addItem(session.passport.user.id);
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
  ) {
    try {
      return this.cartService.setQuantity(session.passport.user.id);
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

      return this.cartService.removeItem(session.passport.user.id);
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
