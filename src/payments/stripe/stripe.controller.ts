import { IsPublic } from "@common/decorators/is-public.decorator";
import { InjectQueue } from "@nestjs/bullmq";
import { Controller, Get, Logger, Query } from "@nestjs/common";
import { Queue } from "bullmq";

import { UpdateOrderStatusDto } from "@/orders/dto/update-order-status.dto";
import { ORDER_QUEUE, ORDER_QUEUE_EVENTS } from "@/orders/orders.constants";
import { OrderStatus } from "@/orders/types/order-status.enum";

import { StripeService } from "./stripe.service";

@Controller("stripe")
export class StripeController {
  private readonly logger = new Logger(StripeController.name);
  constructor(
    @InjectQueue(ORDER_QUEUE) private readonly ordersQueue: Queue,
    private readonly stripeService: StripeService,
  ) {}

  @IsPublic()
  @Get("/success")
  async handleWebhook(@Query("sessionId") sessionId: string, @Query("orderId") orderId: string) {
    const session = await this.stripeService.stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      this.ordersQueue.add(
        ORDER_QUEUE_EVENTS.UPDATE_ORDER_STATUS,
        new UpdateOrderStatusDto(orderId, OrderStatus.PENDING),
      );
    } else if (session.payment_status === "unpaid") {
      this.logger.debug("Payment status unpaid");
    } else {
      this.logger.debug("Stripe other payment status: ", session.payment_status);
    }
  }
}
