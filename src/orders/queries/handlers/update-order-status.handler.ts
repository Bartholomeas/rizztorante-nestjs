import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

import { OrdersService } from "@/orders/orders.service";

import { UpdateOrderStatusCommand } from "../impl/update-order-status.command";

@CommandHandler(UpdateOrderStatusCommand)
export class UpdateOrderStatusHandler implements ICommandHandler<UpdateOrderStatusCommand> {
  constructor(private readonly service: OrdersService) {}
  async execute({ orderId, status }: UpdateOrderStatusCommand) {
    return await this.service.updateOrder(orderId, status);
  }
}
