import type Stripe from "stripe";

export interface StripeLineItem extends Stripe.Checkout.SessionCreateParams.LineItem {}
