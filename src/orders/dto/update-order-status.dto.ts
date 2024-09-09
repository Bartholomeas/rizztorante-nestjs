import { IsEnum } from "class-validator";

import { OrderStatus } from "../types/order-status.enum";

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  public readonly status: OrderStatus;
}
