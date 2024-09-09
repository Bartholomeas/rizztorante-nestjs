import { Injectable, NotImplementedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";

import { CheckoutCreateOrderPayload } from "@events/payloads";

import { Order } from "@/orders/entities/order.entity";

import { OrdersUtils } from "./orders.utils";
import { OrderStatus } from "./types/order-status.enum";

@Injectable()
export class OrdersService {
  constructor(@InjectRepository(Order) private readonly orderRepository: Repository<Order>) {}

  async getOrder() {
    throw new NotImplementedException();
  }

  async getAllOrders() {
    throw new NotImplementedException();
  }

  async changeStatusOrder() {
    throw new NotImplementedException();
  }

  async updateOrder(orderId: string, status: OrderStatus) {
    console.log("updateOrder: ", orderId, status);
    throw new NotImplementedException();
  }

  async deleteOrder() {
    throw new NotImplementedException();
  }

  async createOrder(payload: CheckoutCreateOrderPayload) {
    const orderNumber = OrdersUtils.createOrderId(
      `order-${Date.now()}-${payload.cart?.id}-${payload.user?.id}-${JSON.stringify(payload.checkoutData)}`,
    );

    const order = new Order();
    order.orderNumber = orderNumber;
    order.cart = payload.cart;
    order.checkoutData = payload.checkoutData;

    return await this.orderRepository.save(this.orderRepository.create(order));
  }
}
