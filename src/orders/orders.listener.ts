import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";

import { CheckoutEventTypes } from "@events/events";
import { CheckoutCreateOrderPayload } from "@events/payloads";

import { OrdersService } from "./orders.service";

@Injectable()
export class OrdersListener {
  constructor(private readonly ordersService: OrdersService) {}

  @OnEvent(CheckoutEventTypes.CREATE_ORDER)
  async createOrder(payload: CheckoutCreateOrderPayload) {
    console.log("Checkout event: ");
    return await this.ordersService.createOrder(payload);
  }
}
