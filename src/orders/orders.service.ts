import { Injectable, NotImplementedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";

import { CheckoutCreateOrderPayload } from "@events/payloads";

import { Order } from "@/orders/entities/order.entity";

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

  async updateOrder() {
    throw new NotImplementedException();
  }

  async deleteOrder() {
    throw new NotImplementedException();
  }

  async createOrder(payload: CheckoutCreateOrderPayload) {
    console.log("Robim order:::", payload.cart.user);
    // const order = this.orderRepository.create({
    //   orderNumber: `${Math.random() * 153 * Date.now()}`,
    //   cart: payload.cart,
    //   checkoutData: payload.checkoutData,
    //   // user: payload.cart.user,
    // });

    const order = new Order();
    order.orderNumber = `${Math.random() * Date.now()}`;
    order.cart = payload.cart;
    order.checkoutData = payload.checkoutData;

    const orderCreated = this.orderRepository.create(order);
    // const orderCreated = this.orderRepository.create({});
    return await this.orderRepository.save(orderCreated);
  }
}
