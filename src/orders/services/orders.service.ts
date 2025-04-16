import { JwtPayloadDto } from "@common/dto/jwt-payload.dto";
import { UserRole } from "@common/types/user-roles.type";
import { OrdersCreateOrderPayload } from "@events/payloads/orders";
import { CACHE_MANAGER, Cache } from "@nestjs/cache-manager";
import { Inject, Injectable, NotImplementedException } from "@nestjs/common";
import { FindManyOptions } from "typeorm";

import { Cart } from "@/cart/entities/cart.entity";
import { Order } from "@/orders/entities/order.entity";

import { OrdersUtils } from "../orders.utils";
import { ORDERS_REPOSITORY_DI, OrdersRepository } from "../repositories/orders.repository";
import { OrderStatus } from "../types/order-status.enum";

@Injectable()
export class OrdersService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @Inject(ORDERS_REPOSITORY_DI) private readonly orderRepository: OrdersRepository,
  ) {}

  async findAll({
    user,
    options,
  }: { user?: JwtPayloadDto; options?: FindManyOptions<Order> } = {}) {
    const baseQuery = this.orderRepository
      .createQueryBuilder("order")
      .addOrderBy("order.createdAt", "DESC");

    if (options?.order) {
      Object.entries(options.order).forEach(([key, value]) => {
        if (value === "ASC" || value === "DESC") {
          baseQuery.orderBy(`order.${key}`, value);
        }
      });
    }
    if (user?.role === UserRole.ADMIN)
      return await this.orderRepository.find({
        order: {
          createdAt: "DESC",
        },
        take: 50,
      });
    else
      return await this.orderRepository.find({
        order: {
          createdAt: "DESC",
        },
        take: 50,
      });
  }

  async getSingleOrder(orderId: string, userId: string, role: UserRole = UserRole.GUEST) {
    if (role === UserRole.ADMIN)
      return await this.orderRepository.findOne({
        where: { id: orderId },
      });
    else
      return await this.orderRepository.findOne({
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
    if (role === UserRole.ADMIN) return await this.orderRepository.find({});
    else
      return await this.orderRepository.find({
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
    const order = await this.orderRepository.findOne({
      where: {
        id: orderId,
      },
    });
    order.orderStatus = status;
    return await this.orderRepository.save(order);
  }

  async deleteOrder() {
    throw new NotImplementedException();
  }

  async createOrder(payload: OrdersCreateOrderPayload) {
    const orderNumber = OrdersUtils.createOrderId(
      `order-${Date.now()}-${payload.cart?.id}-${payload.user?.id}-${JSON.stringify(payload.checkoutData)}`,
    );

    const order = new Order();
    order.orderNumber = orderNumber;
    order.cart = { id: payload?.cart.id } as Cart;
    order.user = payload.user;
    order.checkoutDetails = payload.checkoutData;

    return await this.orderRepository.save(order);
  }
}
