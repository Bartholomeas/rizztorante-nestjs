import { BadRequestException, Inject, Injectable, Logger } from "@nestjs/common";

import { PaymentDetailsDto } from "../dto/payment-details.dto";
import { ORDERS_REPOSITORY_DI, OrdersRepository } from "../repositories/orders.repository";
import { OrderStatus } from "../types/order-status.enum";

@Injectable()
export class OrdersProcessingService {
  private readonly logger = new Logger(OrdersProcessingService.name);

  constructor(@Inject(ORDERS_REPOSITORY_DI) private readonly ordersRepository: OrdersRepository) {}

  async updateOrderStatus(orderId: string, orderStatus: OrderStatus = OrderStatus.PENDING) {
    try {
      this.logger.log("Updating order status: ", { orderId, OrderStatus });
      if (!orderId) throw new BadRequestException("Order ID is required");

      return await this.ordersRepository.update(orderId, { orderStatus });
    } catch (err) {
      this.logger.error("Update order status error:", err?.message);
      throw err;
    }
  }

  async updateOrderPaymentDetails(orderId: string, orderPaymentDetails: PaymentDetailsDto) {
    try {
      this.logger.log("Updating order payment details: ", { orderId, orderPaymentDetails });
      if (!orderId) throw new BadRequestException("Order ID is required");

      return await this.ordersRepository.update(orderId, { paymentDetails: orderPaymentDetails });
    } catch (err) {
      this.logger.error("Update order payment details error:", err?.message);
      throw err;
    }
  }
}
