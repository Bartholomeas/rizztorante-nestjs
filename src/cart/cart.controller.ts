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
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { SessionContent } from "@/auth/sessions/types/session.types";
import { AddCartItemDto } from "@/cart/dto/add-cart-item.dto";

import { CartService } from "./cart.service";
import { CartDto } from "./dto/cart.dto";
import { ChangeCartItemQuantityDto } from "./dto/change-cart-item-quantity.dto";

@Controller("cart")
@ApiTags("Cart")
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: "Get cart" })
  @ApiResponse({ type: CartDto })
  async getCart(
    @Session()
    session: SessionContent,
  ): Promise<CartDto> {
    try {
      return this.cartService.getUserCart(session?.passport?.user?.id);
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
    @Body() addCartItemDto: AddCartItemDto,
  ) {
    try {
      return await this.cartService.addToCart(session?.passport?.user?.id, addCartItemDto);
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
      return this.cartService.removeItem(session?.passport?.user?.id, cartItemId);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(err?.message);
    }
  }
}
