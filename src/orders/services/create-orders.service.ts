import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";

import { Repository } from "typeorm";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";

import { OrdersCreateOrderPayload } from "@events/payloads";
import { Cart } from "@/cart/entities/cart.entity";

import { ORDER_QUEUE } from "../orders.constants";
import { OrdersUtils } from "../orders.utils";
import { Order } from "../entities/order.entity";

@Injectable()
export class CreateOrdersService {
  constructor(
    @InjectQueue(ORDER_QUEUE) private readonly ordersQueue: Queue,
    @InjectRepository(Order) private readonly repository: Repository<Order>,
  ) {}

  // async createOrder() {
  //   const orderId = crypto.randomUUID();
  //   return await this.ordersQueue.add("create-order", {
  //     orderId,
  //   });
  // }

  async createOrder(payload: OrdersCreateOrderPayload) {
    const orderNumber = OrdersUtils.createOrderId(
      `order-${Date.now()}-${payload.cartDto?.id}-${payload.user?.id}-${JSON.stringify(payload.checkoutData)}`,
    );

    const order = new Order();
    order.orderNumber = orderNumber;
    order.cart = { id: payload?.cartDto.id } as Cart;
    order.user = payload.user;
    order.checkoutData = payload.checkoutData;
    await this.repository.save(order);

    const orderId = crypto.randomUUID();
    return await this.ordersQueue.add("create-order", {
      orderId,
    });
  }
}
