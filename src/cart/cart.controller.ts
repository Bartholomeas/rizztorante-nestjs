import { JwtUser } from "@common/decorators/jwt-user.decorator";
import { JwtPayloadDto } from "@common/dto/jwt-payload.dto";
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
  ValidationPipe,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { AddCartItemDto } from "@/cart/dto/add-cart-item.dto";

import { CartService } from "./cart.service";
import { ChangeCartItemQuantityDto } from "./dto/change-cart-item-quantity.dto";
import { GetCartResponse } from "./http/responses/get-cart.response";

@Controller("cart")
@ApiTags("Cart")
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: "Get cart" })
  @ApiResponse({ type: GetCartResponse })
  async getCart(
    @JwtUser()
    user: JwtPayloadDto,
  ): Promise<GetCartResponse> {
    const cart = await this.cartService.getUserCart(user?.id);

    return GetCartResponse.fromCart(cart);
  }

  @Post("item")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Add item to cart" })
  async addItem(
    @JwtUser()
    user: JwtPayloadDto,
    @Body() addCartItemDto: AddCartItemDto,
  ) {
    return await this.cartService.addToCart(user?.id, addCartItemDto);
  }

  @Put("item/:cartItemId")
  @ApiOperation({ summary: "Set item quantity" })
  async setItemQuantity(
    @JwtUser()
    user: JwtPayloadDto,
    @Param("cartItemId", new ParseUUIDPipe()) cartItemId: string,
    @Body(ValidationPipe) changeCartItemQuantityDto: ChangeCartItemQuantityDto,
  ) {
    return this.cartService.setQuantity(user?.id, cartItemId, changeCartItemQuantityDto);
  }

  @Delete("item/:cartItemId")
  @ApiOperation({ summary: "Remove item from cart" })
  async removeItem(
    @JwtUser()
    user: JwtPayloadDto,
    @Param("cartItemId", new ParseUUIDPipe()) cartItemId: string,
  ) {
    try {
      return this.cartService.removeItem(user?.id, cartItemId);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(err?.message);
    }
  }
}
