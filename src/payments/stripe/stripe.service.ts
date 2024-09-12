import { Inject, Injectable } from "@nestjs/common";

import Stripe from "stripe";

import { Cart } from "@/cart/entities/cart.entity";

import { STRIPE_KEY } from "./stripe.constants";

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(@Inject(STRIPE_KEY) private readonly apiKey: string) {
    this.stripe = new Stripe(this.apiKey, {
      apiVersion: "2024-06-20",
    });
  }

  async createPayment<T extends Record<string, any>>(cart: Cart, additionalInfo?: Partial<T>) {
    const lineItems = cart?.items?.map(
      (item): Stripe.Checkout.SessionCreateParams.LineItem => ({
        price_data: {
          currency: "pln",
          unit_amount: item.menuPosition.price,
          product_data: {
            name: item.menuPosition.name,
            images: item?.menuPosition?.coreImage?.url ? [item.menuPosition.coreImage.url] : [],
            description: item.menuPosition.description,
          },
        },
        quantity: item.quantity,
      }),
    );

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ["card", "blik", "p24"],
      allow_promotion_codes: true,
      payment_intent_data: {
        metadata: additionalInfo,
      },
      line_items: lineItems,
      mode: "payment",
      success_url: process.env.PAYMENT_SUCCESS_URL,
      cancel_url: process.env.PAYMENT_ERROR_URL,
      locale: "pl",
    });
    return { url: session?.url };
  }
}
