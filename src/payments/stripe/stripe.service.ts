import { Inject, Injectable } from "@nestjs/common";

import Stripe from "stripe";

import { Cart } from "@/cart/entities/cart.entity";
import { STRIPE_KEY } from "@/payments/stripe/stripe.constants";

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(@Inject(STRIPE_KEY) private readonly apiKey: string) {
    this.stripe = new Stripe(this.apiKey, {
      apiVersion: "2024-06-20",
    });
  }

  async createPayment<T extends Record<string, any>>(cart: Cart, additionalInfo?: Partial<T>) {
    console.log("HEHEHE", { cart, additionalInfo });

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ["card", "blik", "p24"],
      allow_promotion_codes: true,
      payment_intent_data: {
        metadata: additionalInfo,
      },
      line_items: [
        {
          price_data: {
            currency: "pln",
            product_data: {
              name: "Spaghetti Carbonara",
              images: [
                "https://t4.ftcdn.net/jpg/00/18/66/99/360_F_18669964_Txz4BS0OErzj9v9DHM3N51d8yFVa85dR.jpg",
              ],
            },
            unit_amount: 2000,
          },
          quantity: 2,
        },
        {
          price_data: {
            currency: "pln",
            product_data: {
              name: "Pizza Marinara",
              images: [
                "https://t4.ftcdn.net/jpg/00/18/66/99/360_F_18669964_Txz4BS0OErzj9v9DHM3N51d8yFVa85dR.jpg",
              ],
            },
            unit_amount: 2000,
          },
          quantity: 2,
        },
      ],
      mode: "payment",
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL,
      locale: "pl",
    });
    return { url: session?.url };
  }
}
