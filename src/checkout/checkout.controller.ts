import { IsPublic } from "@common/decorators/is-public.decorator";
import { JwtUser } from "@common/decorators/jwt-user.decorator";
import { JwtPayloadDto } from "@common/dto/jwt-payload.dto";
import { Body, Controller, Get, Post, ValidationPipe } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { CheckoutService } from "./checkout.service";
import { CheckoutDto } from "./dto/checkout.dto";

@Controller("checkout")
@ApiTags("Checkout")
export class CheckoutController {
  constructor(private readonly service: CheckoutService) {}

  @Post()
  async proceedCheckout(
    @JwtUser()
    user: JwtPayloadDto,
    @Body(ValidationPipe) checkoutDto: CheckoutDto,
  ) {
    return await this.service.proceedCheckout(user?.id, checkoutDto);
  }

  @IsPublic()
  @Get("pickup")
  @ApiOperation({ summary: "Get pickup options" })
  async getPickupOptions() {
    return await this.service.getPickupOptions();
  }

  @IsPublic()
  @Get("payment")
  @ApiOperation({ summary: "Get payment options" })
  async getPaymentOptions() {
    return await this.service.getPaymentOptions();
  }
}
