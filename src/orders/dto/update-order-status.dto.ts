import { ApiProperty } from "@nestjs/swagger";

import { IsEnum } from "class-validator";

import { OrderStatus } from "../types/order-status.enum";

export class UpdateOrderStatusDto {
  @ApiProperty({ enum: OrderStatus })
  @IsEnum(OrderStatus)
  public readonly status: OrderStatus;
}
