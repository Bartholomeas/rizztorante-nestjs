import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";

import { OrderEventTypes } from "@events/events";
import { OrdersCreateOrderPayload } from "@events/payloads/orders";

import { OrdersService } from "./services/orders.service";

@Injectable()
export class OrdersListener {
  constructor(private readonly ordersService: OrdersService) {}

  @OnEvent(OrderEventTypes.CREATE_ORDER)
  async createOrder(payload: OrdersCreateOrderPayload) {
    return await this.ordersService.createOrder(payload);
  }
}
