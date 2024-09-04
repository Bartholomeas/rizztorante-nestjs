import {
  Controller,
  Get,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
  Post,
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

  @Post()
  @ApiOperation({ summary: "Create cart for user" })
  create(@Session() session: SessionContent) {
    try {
      if (!session?.passport?.user)
        throw new NotFoundException("User session not found. Cart cannot be created.");
      return this.cartService.createCartForUser(session.passport.user.id);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(err?.message);
    }
  }
}
