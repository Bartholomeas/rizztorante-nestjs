import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

import { OrdersService } from "@/orders/orders.service";

import { CreateOrderCommand } from "../impl/create-order.command";

@CommandHandler(CreateOrderCommand)
export class CreateOrderHandler implements ICommandHandler<CreateOrderCommand> {
  constructor(private readonly service: OrdersService) {}
  async execute({ command }: CreateOrderCommand) {
    return await this.service.createOrder(command);
  }
}
