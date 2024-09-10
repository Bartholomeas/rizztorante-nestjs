import { Injectable, NotImplementedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";

import { UserRole } from "@common/types/user-roles.types";

import { CheckoutCreateOrderPayload } from "@events/payloads";

import { Order } from "@/orders/entities/order.entity";

import { OrdersUtils } from "./orders.utils";
import { OrderStatus } from "./types/order-status.enum";

@Injectable()
export class OrdersService {
  constructor(@InjectRepository(Order) private readonly repository: Repository<Order>) {}

  async getSingleOrder(orderId: string, userId: string, role: UserRole = UserRole.GUEST) {
    if (role === UserRole.ADMIN)
      return await this.repository.findOne({
        where: { id: orderId },
      });
    else
      return await this.repository.findOne({
        where: [
          {
            id: orderId,
          },
          {
            user: {
              id: userId,
            },
          },
        ],
      });
  }

  async getAllOrders(userId: string, role: UserRole = UserRole.GUEST) {
    if (role === UserRole.ADMIN) return await this.repository.find({});
    else
      return await this.repository.find({
        where: {
          user: {
            id: userId,
          },
        },
      });
  }

  async changeStatusOrder() {
    throw new NotImplementedException();
  }

  async updateOrder(orderId: string, status: OrderStatus) {
    const order = await this.repository.findOne({
      where: {
        id: orderId,
      },
    });
    order.orderStatus = status;
    return await this.repository.save(order);
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
    order.user = payload.user;
    order.checkoutData = payload.checkoutData;

    return await this.repository.save(this.repository.create(order));
  }
}
