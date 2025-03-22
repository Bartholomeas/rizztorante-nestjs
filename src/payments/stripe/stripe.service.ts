import { Currency } from "@common/types/currency.type";
import { InjectQueue } from "@nestjs/bullmq";
import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Queue } from "bullmq";
import Stripe from "stripe";

import { Cart } from "@/cart/entities/cart.entity";
import { ORDER_QUEUE } from "@/orders/orders.constants";

import { StripeLineItem } from "./interfaces/stripe.interfaces";
import { STRIPE_KEY } from "./stripe.constants";

@Injectable()
export class StripeService {
  stripe: Stripe;
  readonly paymentSuccessUrl: string;
  readonly paymentErrorUrl: string;

  constructor(
    private readonly configService: ConfigService,
    @Inject(STRIPE_KEY) private readonly apiKey: string,
    @InjectQueue(ORDER_QUEUE) private readonly ordersQueue: Queue,
  ) {
    this.paymentSuccessUrl = this.configService.get("PAYMENT_SUCCESS_URL");
    this.paymentErrorUrl = this.configService.get("PAYMENT_ERROR_URL");

    this.stripe = new Stripe(this.apiKey, {
      apiVersion: "2024-06-20",
    });
  }

  async validateStripeSignature(signature: string, payload: string) {
    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      this.configService.get("STRIPE_WEBHOOK_SECRET"),
    );
  }

  async createPayment<T extends Record<string, any>>({
    orderId,
    lineItems,
    additionalInfo,
  }: {
    lineItems: StripeLineItem[];
    orderId: string;
    additionalInfo?: Partial<T>;
  }) {
    if (!lineItems.length) throw new BadRequestException("Cart is empty");

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ["card", "blik", "p24"],
      allow_promotion_codes: true,
      payment_intent_data: {
        metadata: { orderId, ...additionalInfo },
      },
      currency: Currency.PLN,
      line_items: lineItems,
      mode: "payment",
      success_url: `http://localhost:8000/api/v1/stripe/success?orderId=${orderId}&sessionId={CHECKOUT_SESSION_ID}`,

      cancel_url: "http://localhost:8000/api/v1/stripe/webhook/error",
      // success_url: this.paymentSuccessUrl, // TODO: Fix this shit, env is setting itself globally, wtf
      // cancel_url: this.paymentErrorUrl,
      locale: "pl",
    });

    return { url: session?.url, session };
  }

  convertCartToLineItems(cart: Cart): StripeLineItem[] {
    return cart?.items?.map(
      (item): StripeLineItem => ({
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
  }
}
