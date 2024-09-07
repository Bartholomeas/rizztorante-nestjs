import {
  Body,
  Controller,
  Get,
  HttpException,
  InternalServerErrorException,
  Post,
  Session,
  ValidationPipe,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { SessionContent } from "@/auth/sessions/types/session.types";

import { CheckoutService } from "./checkout.service";
import { CheckoutDto } from "./dto/checkout.dto";

@Controller("checkout")
@ApiTags("Checkout")
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post()
  async proceedCheckout(
    @Session() session: SessionContent,
    @Body(ValidationPipe) checkoutDto: CheckoutDto,
  ) {
    try {
      return await this.checkoutService.proceedCheckout(session?.passport?.user?.id, checkoutDto);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(err?.message);
    }
  }

  @Get("pickup")
  @ApiOperation({ summary: "Get pickup options" })
  async getPickupOptions() {
    return await this.checkoutService.getPickupOptions();
  }

  @Get("payment")
  @ApiOperation({ summary: "Get payment options" })
  async getPaymentOptions() {
    return await this.checkoutService.getPaymentOptions();
  }
}
