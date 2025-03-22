import { OrderStatus } from "../types/order-status.enum";

// export class UpdateOrderStatusDto {
//   @ApiProperty({ enum: OrderStatus })
//   @IsEnum(OrderStatus)
//   public readonly status: OrderStatus;
// }

export class UpdateOrderStatusDto {
  constructor(
    public readonly orderId: string,
    public readonly status: OrderStatus,
  ) {}
}
