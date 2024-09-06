import { Controller, Post, Put } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { CheckoutService } from "./checkout.service";

@Controller("checkout")
@ApiTags("Checkout")
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post()
  async proceedCheckout() {
    return await this.checkoutService.proceedCheckout();
  }

  @Put("delivery")
  async setDelivery() {
    return await this.checkoutService.setDelivery();
  }

  @Put("payment")
  async setPayment() {
    return await this.checkoutService.setPayment();
  }
}
