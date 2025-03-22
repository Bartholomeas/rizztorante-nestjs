import { OrderEventTypes } from "@events/events";
import { OrdersCreateOrderPayload } from "@events/payloads/orders";
import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";

import { OrdersCreationService } from "./services/orders-creation.service";

@Injectable()
export class OrdersListener {
  constructor(private readonly createOrderService: OrdersCreationService) {}

  @OnEvent(OrderEventTypes.CREATE_ORDER)
  async createOrder(payload: OrdersCreateOrderPayload) {
    return await this.createOrderService.createOrder(payload);
  }
}
