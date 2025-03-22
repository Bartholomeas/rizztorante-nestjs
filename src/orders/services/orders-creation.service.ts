import { Currency } from "@common/types/currency.type";
import { OrdersCreateOrderPayload } from "@events/payloads";
import { InjectQueue } from "@nestjs/bullmq";
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Queue } from "bullmq";
import { Repository } from "typeorm";

import { Cart } from "@/cart/entities/cart.entity";

import { OrderDetailsEntry } from "../dto/order-details.dto";
import { PaymentDetailsDto } from "../dto/payment-details.dto";
import { Order } from "../entities/order.entity";
import { ORDER_QUEUE } from "../orders.constants";
import { OrdersUtils } from "../orders.utils";
import { OrderStatus } from "../types/order-status.enum";

@Injectable()
export class OrdersCreationService {
  private readonly logger = new Logger(OrdersCreationService.name);

  constructor(
    @InjectQueue(ORDER_QUEUE) private readonly ordersQueue: Queue,
    @InjectRepository(Order) private readonly repository: Repository<Order>,
  ) {}

  async createOrder(payload: OrdersCreateOrderPayload, orderStatus = OrderStatus.NEW) {
    try {
      this.logger.log("Creating order", { payload });

      const orderNumber = OrdersUtils.createOrderId(
        `order-${Date.now()}-${payload.cart?.id}-${payload.user?.id}-${JSON.stringify(payload.checkoutData)}`,
      );

      const order = new Order();

      if (payload.orderId) order.id = payload.orderId;

      order.orderStatus = orderStatus;
      order.orderNumber = orderNumber;
      order.cart = { id: payload?.cart.id } as Cart;
      order.user = payload.user;
      order.checkoutDetails = payload.checkoutData;
      order.orderDetails = OrderDetailsEntry.fromCart(payload?.cart);
      order.amount = payload?.cart.total;
      order.currency = Currency.PLN; // TODO: Currently only PLN
      order.paymentDetails = new PaymentDetailsDto();

      return await this.repository.save(order);
    } catch (error) {
      this.logger.error("Failed to create order", { error, payload });
      throw error;
    }
  }
}
