import { Controller, Get, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { CheckoutService } from "./checkout.service";

@Controller("checkout")
@ApiTags("Checkout")
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post()
  async proceedCheckout() {
    return await this.checkoutService.proceedCheckout();
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
