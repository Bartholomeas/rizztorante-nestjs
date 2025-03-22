import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Logger } from "@nestjs/common";
import { Job } from "bullmq";

import { ORDER_QUEUE, ORDER_QUEUE_EVENTS } from "./orders.constants";
import { OrdersCreationService } from "./services/orders-creation.service";
import { OrdersProcessingService } from "./services/orders-processing.service";
import { OrderStatus } from "./types/order-status.enum";

@Processor(ORDER_QUEUE)
export class OrdersProcessor extends WorkerHost {
  constructor(
    private readonly createOrderService: OrdersCreationService,
    private readonly orderProcessingService: OrdersProcessingService,
  ) {
    super();
  }
  private readonly logger = new Logger(OrdersProcessor.name);

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log("Process:", job.name, job.id);
    switch (job.name) {
      case ORDER_QUEUE_EVENTS.CREATE_ORDER:
        return await this.createOrderService.createOrder(job?.data, OrderStatus.NEW);
      case ORDER_QUEUE_EVENTS.UPDATE_ORDER_STATUS:
        this.logger.log("Update order status processor case", { job: job.data });
        return await this.orderProcessingService.updateOrderStatus(
          job?.data?.orderId,
          job?.data?.status,
        );
      case ORDER_QUEUE_EVENTS.UPDATE_ORDER_PAYMENT_DETAILS:
        this.logger.log("Update order payment details processor case", { job: job.data });
        return await this.orderProcessingService.updateOrderPaymentDetails(
          job?.data?.orderId,
          job?.data?.paymentDetails,
        );
      default:
        this.logger.log("Default processor case");
        return;
    }
  }
}
