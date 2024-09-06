import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";

import { CartEventTypes } from "@events/cart/cart.events";

import { StripeService } from "@/payments/stripe/stripe.service";

@Injectable()
export class PaymentsService {
  constructor(private readonly stripeService: StripeService) {}

  @OnEvent(CartEventTypes.PROCEED_CHECKOUT)
  async createPayment(smth: any) {
    console.log("XD", smth);
    // Poczebujem: userId (?), koszyk, dane do platnosci
    return this.stripeService.createPayment();
  }
}
