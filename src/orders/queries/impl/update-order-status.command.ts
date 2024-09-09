import { IsNotEmpty, IsEnum } from "class-validator";

import { OrderStatus } from "@/orders/types/order-status.enum";

export class UpdateOrderStatusCommand {
  @IsNotEmpty()
  public readonly orderId: string;

  @IsEnum(OrderStatus)
  public readonly status: OrderStatus;

  constructor(orderId: string, status: OrderStatus) {
    this.orderId = orderId;
    this.status = status;
  }
}
