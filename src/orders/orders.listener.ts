import { Injectable, NotImplementedException } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";

import { CheckoutEventTypes } from "@events/events";
import { CheckoutCreateOrderPayload } from "@events/payloads";

import { OrdersService } from "./orders.service";

@Injectable()
export class OrdersListener {
  constructor(private readonly ordersServcie: OrdersService) {}

  @OnEvent(CheckoutEventTypes.CREATE_ORDER)
  async createOrder(payload: CheckoutCreateOrderPayload) {
    console.log("Checkout event: ", payload);
    await this.ordersServcie.createOrder(payload);
    throw new NotImplementedException();
  }
}
