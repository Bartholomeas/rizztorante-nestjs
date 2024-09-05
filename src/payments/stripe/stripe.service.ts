import { Inject, Injectable } from "@nestjs/common";

import Stripe from "stripe";

import { STRIPE_KEY } from "@/payments/stripe/stripe.constants";

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(@Inject(STRIPE_KEY) private readonly apiKey: string) {
    this.stripe = new Stripe(this.apiKey, {
      apiVersion: "2024-06-20",
    });
  }

  async createPayment() {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ["card", "blik", "p24"],
      line_items: [
        {
          price: "1234",
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:3000/api/success`,
      cancel_url: `http://localhost:3000/api/error`,
      locale: "pl",
    });
    console.log("stripe session", session);
  }
}
